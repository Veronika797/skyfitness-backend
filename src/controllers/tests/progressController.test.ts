import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../test/setup.js";
import User from "../../models/User.js";
import Course from "../../models/Course.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/constants.js";
import type { UserWithProgress } from "../../types/testTypes.js";

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

describe("PATCH /api/fitness/courses/:courseId/workouts/:workoutId", () => {
  let token: string;
  let userId: string;
  let courseId: string;
  let workoutId: string;

  beforeEach(async () => {
    jest.clearAllMocks();

    const user = await User.create({
      email: `progress-${Date.now()}@example.com`,
      password: "Secure@123!",
      selectedCourses: [],
    });
    userId = user._id.toString();
    token = generateToken(userId);

    courseId = "yoga_001";
    workoutId = "w1";

    await Course.create({
      _id: courseId,
      nameRU: "Йога",
      nameEN: "Yoga",
      description: "Тестовое описание курса для тестов",
      directions: [],
      fitting: [],
      workouts: [workoutId],
      difficulty: "легкий",
      durationInDays: 20,
      dailyDurationInMinutes: { from: 20, to: 40 },
    });
  });

  it("должен сохранять прогресс тренировки", async () => {
    const progressData = [5, 10, 15];

    const res = await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progressData })
      .expect(200);

    expect(res.body.message).toBe("Прогресс сохранён!");

    await User.updateOne({ _id: userId }, {});
    const user = (await User.findById(
      userId,
    ).lean()) as unknown as UserWithProgress | null;

    const courseProgress = user?.progress?.find((p) => p.courseId === courseId);

    expect(courseProgress).toBeTruthy();
    expect(courseProgress?.workoutsProgress).toContainEqual(
      expect.objectContaining({
        workoutId,
        progressData,
      }),
    );
  });

  it("должен обновлять существующий прогресс", async () => {
    await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progressData: [1, 2, 3] });

    const newProgress = [10, 20, 30];
    const res = await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progressData: newProgress })
      .expect(200);

    expect(res.body.message).toBe("Прогресс сохранён!");

    const user = (await User.findById(
      userId,
    ).lean()) as unknown as UserWithProgress | null;

    const courseProgress = user?.progress?.find((p) => p.courseId === courseId);

    const workoutProgress = courseProgress?.workoutsProgress?.find(
      (w) => w.workoutId === workoutId,
    );

    expect(workoutProgress?.progressData).toEqual(newProgress);
  });

  it("должен возвращать 401 без токена", async () => {
    await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .send({ progressData: [1, 2, 3] })
      .expect(401);
  });

  it("должен возвращать 400, если progressData не массив", async () => {
    await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progressData: "not-an-array" })
      .expect(400);
  });
});

describe("GET /api/fitness/users/me/progress", () => {
  let token: string;
  let userId: string;
  let courseId: string;

  beforeEach(async () => {
    jest.clearAllMocks();

    const user = await User.create({
      email: `getprogress-${Date.now()}@example.com`,
      password: "Secure@123!",
      selectedCourses: [],
    });
    userId = user._id.toString();
    token = generateToken(userId);

    courseId = "yoga_001";

    await Course.create({
      _id: courseId,
      nameRU: "Йога",
      nameEN: "Yoga",
      description: "Тестовое описание курса для тестов",
      directions: [],
      fitting: [],
      workouts: ["w1", "w2"],
      difficulty: "легкий",
      durationInDays: 20,
      dailyDurationInMinutes: { from: 20, to: 40 },
    });
  });

  it("должен возвращать прогресс курса", async () => {
    await request(app)
      .patch(`/api/fitness/courses/${courseId}/workouts/w1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ progressData: [5, 10] });

    const res = await request(app)
      .get(`/api/fitness/users/me/progress?courseId=${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("courseId", courseId);
    expect(res.body).toHaveProperty("workoutsProgress");
    expect(res.body.workoutsProgress).toContainEqual(
      expect.objectContaining({
        workoutId: "w1",
        progressData: [5, 10],
      }),
    );
  });

  it("должен возвращать пустой прогресс, если ничего не сохранено", async () => {
    const res = await request(app)
      .get(`/api/fitness/users/me/progress?courseId=${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("courseId", courseId);
    expect(res.body.workoutsProgress).toEqual([]);
  });

  it("должен возвращать 401 без токена", async () => {
    await request(app)
      .get(`/api/fitness/users/me/progress?courseId=${courseId}`)
      .expect(401);
  });

  it("должен возвращать 404, если пользователь не найден", async () => {
    const fakeToken = generateToken("507f1f77bcf86cd799439011");

    await request(app)
      .get(`/api/fitness/users/me/progress?courseId=${courseId}`)
      .set("Authorization", `Bearer ${fakeToken}`)
      .expect(404);
  });
});
