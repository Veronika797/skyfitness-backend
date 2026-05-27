import express from "express";
import {
  getMe,
  addUserCourse,
  removeUserCourse,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/me/courses", authMiddleware, addUserCourse);
router.delete("/me/courses/:courseId", authMiddleware, removeUserCourse);

export default router;
