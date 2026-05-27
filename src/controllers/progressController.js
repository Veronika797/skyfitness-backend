import User from "../models/User.js";

export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, workoutId } = req.params;
    const { progressData } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    if (!Array.isArray(progressData)) {
      return res
        .status(400)
        .json({ message: "progressData должен быть массивом" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.progress) user.progress = [];

    const courseProgress = user.progress?.find((p) => p.courseId === courseId);

    if (!courseProgress) {
      courseProgress = {
        courseId,
        courseCompleted: false,
        workoutsProgress: [],
      };
      user.progress.push(courseProgress);
    }

    let workoutProgress = courseProgress.workoutsProgress?.find(
      (w) => w.workoutId === workoutId,
    );

    if (workoutProgress) {
      workoutProgress.progressData = progressData;
      workoutProgress.workoutCompleted = progressData.every((val) => val > 0);
    } else {
      courseProgress.workoutsProgress.push({
        workoutId,
        workoutCompleted: progressData.every((val) => val > 0),
        progressData: progressData,
      });
    }

    if (courseProgress.workoutsProgress.length > 0) {
      courseProgress.courseCompleted = courseProgress.workoutsProgress.every(
        (w) => w.workoutCompleted,
      );
    }

    await user.save();

    res.json({ message: "Прогресс сохранён!" });
  } catch (error) {
    console.error("Ошибка сохранения прогресса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const saveWorkoutProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, workoutId } = req.params;
    const { progressData } = req.body;

    if (!courseId || !workoutId || !Array.isArray(progressData)) {
      return res.status(400).json({ message: "Неверные данные" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.progress) user.progress = [];

    let courseProgress = user.progress.find((p) => p.courseId === courseId);
    if (!courseProgress) {
      courseProgress = {
        courseId,
        courseCompleted: false,
        workoutsProgress: [],
      };
      user.progress.push(courseProgress);
    }

    let workoutProgress = courseProgress.workoutsProgress?.find(
      (w) => w.workoutId === workoutId,
    );

    if (workoutProgress) {
      workoutProgress.progressData = progressData;
      workoutProgress.workoutCompleted = progressData.every((val) => val > 0);
    } else {
      courseProgress.workoutsProgress.push({
        workoutId,
        workoutCompleted: progressData.every((val) => val > 0),
        progressData,
      });
    }

    courseProgress.courseCompleted = courseProgress.workoutsProgress.every(
      (w) => w.workoutCompleted,
    );

    await user.save();
    res.json({ message: "Прогресс сохранён!" });
  } catch (error) {
    console.error("Ошибка saveWorkoutProgress:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const resetCourseProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.progress) {
      user.progress = user.progress.filter((p) => p.courseId !== courseId);
      await user.save();
    }

    res.json({ message: "Прогресс курса удалён!" });
  } catch (error) {
    console.error("Ошибка resetCourseProgress:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
