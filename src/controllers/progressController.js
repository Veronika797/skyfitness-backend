import User from "../models/User.js";

export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    if (!userId) {
      return res.json({
        courseId,
        courseCompleted: false,
        workoutsProgress: [],
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const courseProgress = user.progress?.find((p) => p.courseId === courseId);

    if (!courseProgress) {
      return res.json({
        courseId,
        courseCompleted: false,
        workoutsProgress: [],
      });
    }

    res.json(courseProgress);
  } catch (error) {
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

    let progress = user.progress
      ? user.progress.toObject().map((p) => ({ ...p }))
      : [];

    let courseProgress = progress.find((p) => p.courseId === courseId);
    if (!courseProgress) {
      courseProgress = {
        courseId,
        courseCompleted: false,
        workoutsProgress: [],
      };
      progress.push(courseProgress);
    }

    const workoutCompleted = progressData.every((val) => val > 0);
    let workoutProgress = courseProgress.workoutsProgress?.find(
      (w) => String(w.workoutId) === String(workoutId),
    );

    if (workoutProgress) {
      workoutProgress.progressData = [...progressData];
      workoutProgress.workoutCompleted = workoutCompleted;
    } else {
      courseProgress.workoutsProgress.push({
        workoutId,
        workoutCompleted,
        progressData: [...progressData],
      });
    }

    courseProgress.courseCompleted = courseProgress.workoutsProgress.every(
      (w) => w.workoutCompleted,
    );

    await User.findByIdAndUpdate(
      userId,
      { $set: { progress } },
      { new: true, runValidators: false },
    );

    res.json({ message: "Прогресс сохранён!" });
  } catch (error) {
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
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const resetWorkoutProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId, workoutId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    const courseProgress = user.progress?.find((p) => p.courseId === courseId);
    if (courseProgress) {
      courseProgress.workoutsProgress =
        courseProgress.workoutsProgress?.filter(
          (w) => w.workoutId !== workoutId,
        ) || [];
      await user.save();
    }

    res.json({ message: "Прогресс тренировки удалён!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
