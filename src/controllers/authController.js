import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../utils/constants.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Введите корректный Email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Пароль должен содержать не менее 6 символов" });
    }
    const specialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    if (specialChars < 2) {
      return res
        .status(400)
        .json({ message: "Пароль должен содержать не менее 2 спецсимволов" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Пароль должен содержать как минимум одну заглавную букву",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      message: "Регистрация прошла успешно!",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });

    res.json({
      message: "Вход выполнен успешно",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
