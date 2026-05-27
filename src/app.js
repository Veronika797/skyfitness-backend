import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import { PORT, CORS_ORIGIN } from "./utils/constants.js";
import progressRoutes from "./routes/progressRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/fitness/auth", authRoutes);
app.use("/api/fitness/users", userRoutes);
app.use("/api/fitness/progress", progressRoutes);
app.use("/api/fitness/courses", courseRoutes);
app.use("/api/fitness", workoutRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

start();
