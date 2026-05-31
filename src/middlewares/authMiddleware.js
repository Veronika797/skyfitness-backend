import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Ошибка авторизации" });
  }
};
