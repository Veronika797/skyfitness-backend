import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import { PORT, CORS_ORIGIN } from "./utils/constants.js";

import type { Application, Request, Response, NextFunction } from "express";

export const app: Application = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use("/api/fitness", progressRoutes);
app.use("/api/fitness/users", userRoutes);
app.use("/api/fitness/auth", authRoutes);
app.use("/api/fitness/courses", courseRoutes);
app.use("/api/fitness", workoutRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Что-то пошло не так" });
});

export const startServer = async () => {
  try {
    await connectDB();
    return app.listen(PORT, () => {
      console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
    process.exit(1);
  }
};
