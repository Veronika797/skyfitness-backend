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
    console.error("Ошибка getMe:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const addUserCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "courseId обязателен" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.selectedCourses.includes(courseId)) {
      user.selectedCourses.push(courseId);
      await user.save();
    }

    res.json({ message: "Курс успешно добавлен!" });
  } catch (error) {
    console.error("Ошибка addUserCourse:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const removeUserCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.selectedCourses = user.selectedCourses.filter((id) => id !== courseId);
    await user.save();

    res.json({ message: "Курс успешно удален!" });
  } catch (error) {
    console.error("Ошибка removeUserCourse:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
