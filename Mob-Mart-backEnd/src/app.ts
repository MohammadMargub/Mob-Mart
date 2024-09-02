import express from "express";

import userRoutes from "./routes/userRouter.js";
import productRoutes from "./routes/productsRouter.js";
import { connectDB } from "./database/database.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config({ path: "./config.env" });

export const myCache = new NodeCache();

const app = express();
const port = process.env.PORT ?? 3000;

connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send(`API is working wait plz`);
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is running on this port  number ${port}`);
});
