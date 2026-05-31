import request from "supertest";
import { app } from "../../test/setup.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/constants.js";

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

describe("GET /api/fitness/users/me", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      email: "me@example.com",
      password: await bcrypt.hash("Secure@123", 10),
      selectedCourses: ["course_001", "course_002"],
    });
    userId = user._id.toString();
    token = generateToken(userId);
  });

  it("должен возвращать данные пользователя с токеном", async () => {
    const res = await request(app)
      .get("/api/fitness/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("email", "me@example.com");
    expect(res.body).toHaveProperty("selectedCourses");
    expect(res.body.selectedCourses).toEqual(["course_001", "course_002"]);
    expect(res.body).not.toHaveProperty("password");
  });

  it("должен возвращать 401 без токена", async () => {
    await request(app).get("/api/fitness/users/me").expect(401);
  });

  it("должен возвращать 401 с невалидным токеном", async () => {
    await request(app)
      .get("/api/fitness/users/me")
      .set("Authorization", "Bearer invalid.token.here")
      .expect(401);
  });

  it("должен возвращать 404, если пользователь не найден", async () => {
    const fakeToken = generateToken("507f1f77bcf86cd799439011");

    await request(app)
      .get("/api/fitness/users/me")
      .set("Authorization", `Bearer ${fakeToken}`)
      .expect(404);
  });
});

describe("POST /api/fitness/users/me/courses", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      email: "courses@example.com",
      password: await bcrypt.hash("Secure@123", 10),
      selectedCourses: [],
    });
    userId = user._id.toString();
    token = generateToken(userId);
  });

  it("должен добавлять курс в selectedCourses", async () => {
    const res = await request(app)
      .post("/api/fitness/users/me/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: "yoga_001" })
      .expect(200);

    expect(res.body.message).toBe("Курс успешно добавлен!");

    const user = await User.findById(userId);
    expect(user?.selectedCourses).toContain("yoga_001");
  });

  it("должен возвращать 400, если courseId не передан", async () => {
    const res = await request(app)
      .post("/api/fitness/users/me/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(res.body.message).toBe("courseId обязателен");
  });

  it("не должен дублировать курс, если он уже добавлен", async () => {
    await request(app)
      .post("/api/fitness/users/me/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: "yoga_001" });

    const res = await request(app)
      .post("/api/fitness/users/me/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: "yoga_001" })
      .expect(200);

    expect(res.body.message).toBe("Курс успешно добавлен!");

    const user = await User.findById(userId);
    expect(user?.selectedCourses.filter((id) => id === "yoga_001").length).toBe(
      1,
    );
  });
});

describe("DELETE /api/fitness/users/me/courses/:courseId", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      email: "remove@example.com",
      password: await bcrypt.hash("Secure@123", 10),
      selectedCourses: ["yoga_001", "fitness_002"],
    });
    userId = user._id.toString();
    token = generateToken(userId);
  });

  it("должен удалять курс из selectedCourses", async () => {
    const res = await request(app)
      .delete("/api/fitness/users/me/courses/yoga_001")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("Курс успешно удален!");

    const user = await User.findById(userId);
    expect(user?.selectedCourses).not.toContain("yoga_001");
    expect(user?.selectedCourses).toContain("fitness_002");
  });

  it("не должен падать, если курс не найден в списке", async () => {
    const res = await request(app)
      .delete("/api/fitness/users/me/courses/nonexistent_001")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("Курс успешно удален!");
  });

  it("должен возвращать 401 без токена", async () => {
    await request(app)
      .delete("/api/fitness/users/me/courses/yoga_001")
      .expect(401);
  });
});
