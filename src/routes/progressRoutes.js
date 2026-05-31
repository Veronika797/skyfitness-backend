import express from "express";
import {
  getCourseProgress,
  saveWorkoutProgress,
  resetCourseProgress,
} from "../controllers/progressController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users/me/progress", getCourseProgress);

router.patch(
  "/courses/:courseId/workouts/:workoutId",
  authMiddleware,
  saveWorkoutProgress,
);

router.patch("/courses/:courseId/reset", authMiddleware, resetCourseProgress);

export default router;
