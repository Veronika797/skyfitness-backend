import request from "supertest";
import { app } from "../../test/setup.js";
import Course from "../../models/Course.js";

describe("GET /api/fitness/courses", () => {
  beforeEach(async () => {
    await Course.insertMany([
      {
        _id: "yoga_001",
        nameRU: "Йога",
        nameEN: "Yoga",
        description: "Описание",
        directions: [],
        fitting: [],
        workouts: [],
        difficulty: "легкий",
        durationInDays: 20,
        dailyDurationInMinutes: { from: 20, to: 40 },
      },
      {
        _id: "fitness_002",
        nameRU: "Фитнес",
        nameEN: "Fitness",
        description: "Описание",
        directions: [],
        fitting: [],
        workouts: [],
        difficulty: "сложный",
        durationInDays: 30,
        dailyDurationInMinutes: { from: 30, to: 60 },
      },
    ]);
  });

  it("должен возвращать список курсов", async () => {
    const res = await request(app).get("/api/fitness/courses").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("nameRU", "Йога");
    expect(res.body[1]).toHaveProperty("nameRU", "Фитнес");
  });
});

describe("GET /api/fitness/courses/:id", () => {
  beforeEach(async () => {
    await Course.create({
      _id: "yoga_001",
      nameRU: "Йога",
      nameEN: "Yoga",
      description: "Древняя практика",
      directions: ["Хатха"],
      fitting: ["Для начинающих"],
      workouts: ["w1", "w2"],
      difficulty: "легкий",
      durationInDays: 20,
      dailyDurationInMinutes: { from: 20, to: 40 },
    });
  });

  it("должен возвращать курс по ID", async () => {
    const res = await request(app)
      .get("/api/fitness/courses/yoga_001")
      .expect(200);

    expect(res.body).toHaveProperty("nameRU", "Йога");
    expect(res.body).toHaveProperty("workouts", ["w1", "w2"]);
  });

  it("должен возвращать 404, если курс не найден", async () => {
    await request(app).get("/api/fitness/courses/nonexistent").expect(404);
  });
});
