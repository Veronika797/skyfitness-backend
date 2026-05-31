import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../test/setup.js";
import User from "../../models/User.js";

describe("POST /api/fitness/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен регистрировать нового пользователя", async () => {
    const userData = {
      email: "test@example.com",
      password: "Secure@123!",
    };

    const res = await request(app)
      .post("/api/fitness/auth/register")
      .send(userData)
      .expect(201);

    expect(res.body).toHaveProperty("message", "Регистрация прошла успешно!");

    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);

    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
    expect(user?.email).toBe(userData.email);
  });

  it("должен возвращать 409, если пользователь уже существует", async () => {
    await request(app)
      .post("/api/fitness/auth/register")
      .send({ email: "dup@example.com", password: "Secure@123!" });

    const res = await request(app)
      .post("/api/fitness/auth/register")
      .send({ email: "dup@example.com", password: "Secure@123!" })
      .expect(409);

    expect(res.body.message).toBe("Пользователь с таким email уже существует");
  });
});

describe("POST /api/fitness/auth/login", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await User.create({
      email: "login@example.com",
      password: "Secure@123!",
    });
  });

  it("должен возвращать токен при верных данных", async () => {
    const res = await request(app)
      .post("/api/fitness/auth/login")
      .send({ email: "login@example.com", password: "Secure@123!" })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Вход выполнен успешно");
    expect(res.body).toHaveProperty("token");
  });

  it("должен возвращать 404, если пользователь не найден", async () => {
    const res = await request(app)
      .post("/api/fitness/auth/login")
      .send({ email: "nobody@example.com", password: "Secure@123!" })
      .expect(404);

    expect(res.body.message).toBe("Пользователь с таким email не найден");
  });

  it("должен возвращать 401, если пароль неверный", async () => {
    const res = await request(app)
      .post("/api/fitness/auth/login")
      .send({ email: "login@example.com", password: "WrongPass@123!" })
      .expect(401);

    expect(res.body.message).toBe("Неверный пароль");
  });
});
