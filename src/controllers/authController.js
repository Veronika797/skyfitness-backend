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
      return res
        .status(400)
        .json({
          message: "Пароль должен содержать как минимум одну заглавную букву",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "Регистрация прошла успешно!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
};
