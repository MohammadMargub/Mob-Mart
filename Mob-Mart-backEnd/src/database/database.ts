import mongoose from "mongoose";
import { DB_URL, DB_NAME } from "../config/dbConfig.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL!, {
      dbName: DB_NAME
    });
    console.log(`DB connected to ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to DB: ${error}`);
    process.exit(1);
  }
};
