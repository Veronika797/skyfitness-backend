export const PORT = process.env.PORT || 3006;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skyfitness";
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const JWT_EXPIRES_IN = "7d";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5174";
