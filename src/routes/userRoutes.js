import express from "express";
import {
  getMe,
  addUserCourse,
  removeUserCourse,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get(
  "/me",
  authMiddleware,
  (req, res, next) => {
    next();
  },
  getMe,
);

router.post(
  "/me/courses",
  authMiddleware,
  (req, res, next) => {
    next();
  },
  addUserCourse,
);

router.delete(
  "/me/courses/:courseId",
  authMiddleware,
  (req, res, next) => {
    next();
  },
  removeUserCourse,
);

export default router;
