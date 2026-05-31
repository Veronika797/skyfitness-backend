import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";

process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test-secret-key-for-jest-do-not-use-in-prod";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

export { app };
