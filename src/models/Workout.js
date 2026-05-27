import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  exercises: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model("Workout", workoutSchema);
