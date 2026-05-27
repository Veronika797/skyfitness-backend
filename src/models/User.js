import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  selectedCourses: [
    {
      type: String,
      ref: "Course",
    },
  ],
  progress: [
    {
      courseId: { type: String, required: true },
      courseCompleted: { type: Boolean, default: false },
      workoutsProgress: [
        {
          workoutId: { type: String, required: true },
          workoutCompleted: { type: Boolean, default: false },
          progressData: [{ type: Number, default: 0 }],
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
