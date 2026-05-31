import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("-__v");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({ _id: courseId }).select("-__v");

    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getCourseWorkouts = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("workouts")
      .select("workouts");

    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    res.json(course.workouts);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
