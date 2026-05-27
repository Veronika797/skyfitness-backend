import express from "express";
import Course from "../models/Course.js";
import Workout from "../models/Workout.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("Ошибка получения курсов:", err);
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
    console.error("Ошибка получения курса:", err);
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
    console.error("Ошибка:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
