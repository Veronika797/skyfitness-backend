import express from "express";
import Course from "../models/Course.js";
import Workout from "../models/Workout.js";
import {
  saveWorkoutProgress,
  resetCourseProgress,
  resetWorkoutProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });

    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/:courseId/workouts", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    const workouts = await Workout.find({ _id: { $in: course.workouts } });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.patch("/:courseId/workouts/:workoutId", saveWorkoutProgress);
router.patch("/:courseId/reset", resetCourseProgress);
router.patch("/:courseId/workouts/:workoutId/reset", resetWorkoutProgress);

export default router;
