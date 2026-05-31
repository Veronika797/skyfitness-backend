import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      email: user.email,
      selectedCourses: user.selectedCourses || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const addUserCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.selectedCourses) {
      user.selectedCourses = [];
    }

    if (!user.selectedCourses.includes(courseId)) {
      user.selectedCourses.push(courseId);
      await user.save();
    }

    res.json({ message: "Курс успешно добавлен!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const removeUserCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.selectedCourses?.includes(courseId)) {
      user.selectedCourses = user.selectedCourses.filter(
        (id) => id !== courseId,
      );
      await user.save();
    }

    res.json({ message: "Курс успешно удален!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
