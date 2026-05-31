import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../test/setup.js";
import Course from "../../models/Course.js";
import Workout from "../../models/Workout.js";

describe("GET /api/fitness/courses/:courseId/workouts/:workoutId", () => {
  const courseId = "yoga_001";
  const workoutId = "w1";

  beforeEach(async () => {
    jest.clearAllMocks();

    await Workout.create({
      _id: workoutId,
      name: "Урок 1. Введение",
      video: "https://youtube.com/embed/test",
      exercises: [
        { name: "Собака мордой вниз", quantity: 10 },
        { name: "Поза ребёнка", quantity: 15 },
      ],
    });

    await Course.create({
      _id: courseId,
      nameRU: "Йога",
      nameEN: "Yoga",
      description: "Древняя практика",
      directions: [],
      fitting: [],
      workouts: [workoutId],
      difficulty: "легкий",
      durationInDays: 20,
      dailyDurationInMinutes: { from: 20, to: 40 },
    });
  });

  it("должен возвращать тренировку по ID", async () => {
    const res = await request(app)
      .get(`/api/fitness/courses/${courseId}/workouts/${workoutId}`)
      .expect(200);

    expect(res.body).toHaveProperty("_id", workoutId);
    expect(res.body).toHaveProperty("name", "Урок 1. Введение");
    expect(res.body).toHaveProperty("video");
    expect(res.body.exercises).toHaveLength(2);
    expect(res.body.exercises[0]).toHaveProperty("name", "Собака мордой вниз");
  });

  it("должен возвращать 404, если курс не найден", async () => {
    await request(app)
      .get(`/api/fitness/courses/nonexistent/workouts/${workoutId}`)
      .expect(404);
  });

  it("должен возвращать 404, если тренировка не найдена в курсе", async () => {
    await request(app)
      .get(`/api/fitness/courses/${courseId}/workouts/nonexistent`)
      .expect(404);
  });
});
