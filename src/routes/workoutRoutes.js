import express from "express";
import {
  getWorkoutById,
  getWorkoutsByCourse,
  createWorkout,
  addWorkoutToCourse,
} from "../controllers/workoutController.js";

const router = express.Router();

router.get("/courses/:courseId/workouts/:workoutId", getWorkoutById);
router.post("/workouts", createWorkout);
router.post("/courses/:courseId/workouts", addWorkoutToCourse);
router.get("/courses/:courseId/workouts", getWorkoutsByCourse);

export default router;
