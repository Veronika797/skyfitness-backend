import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
