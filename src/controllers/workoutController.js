import Workout from "../models/Workout.js";
import Course from "../models/Course.js";

export const getWorkoutById = async (req, res) => {
  try {
    const { courseId, workoutId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ message: "Тренировка не найдена" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getWorkoutsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    const workouts = await Workout.find({ _id: { $in: course.workouts } });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const { _id, name, video, exercises } = req.body;

    const workout = new Workout({
      _id,
      name,
      video,
      exercises,
    });

    await workout.save();
    res.status(201).json({ message: "Тренировка создана!", workout });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const addWorkoutToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { workoutId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    if (!course.workouts.includes(workoutId)) {
      course.workouts.push(workoutId);
      await course.save();
    }

    res.json({ message: "Тренировка добавлена к курсу!", course });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
