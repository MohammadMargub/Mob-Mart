import mongoose from "mongoose";
import { DB_URL, DB_NAME } from "../config/dbConfig.js";

export const connectDB = async () => {
  try {
    if (DB_URL) {
      await mongoose.connect(DB_URL, {
        dbName: DB_NAME
      });
      console.log(`DB connected to ${mongoose.connection.host}`);
    } else {
      console.error("DB_URL is not defined. Please set the database URL before connecting.");
    }
  } catch (error) {
    console.error(`Error connecting to DB: ${error}`);
    process.exit(1);
  }
};
