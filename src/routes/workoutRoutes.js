import express from "express";
const router = express.Router();

router.get("/workouts/:workoutId", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Тренировка не найдена" });
    }
    res.json(workout);
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
