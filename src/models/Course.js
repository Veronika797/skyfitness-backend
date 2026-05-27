import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["легкий", "средний", "сложный"],
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true,
    },
    dailyDurationInMinutes: {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
    },
    directions: {
      type: [String],
      default: [],
    },
    fitting: {
      type: [String],
      default: [],
    },
    workouts: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Course", courseSchema);
