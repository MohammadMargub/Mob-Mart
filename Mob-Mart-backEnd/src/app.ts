import express from "express";
import { decryptRequestBody } from "./utils/encryption.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoutes from "./routes/productsRouter.js";
import paymentRoutes from "./routes/paymentRouter.js";
import statistics from "./routes/statisticsRouter.js";
import { connectDB } from "./database/database.js";
import orderRoutes from "./routes/orderRouter.js";
import userRoutes from "./routes/userRouter.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./config.env" });

export const myCache = new NodeCache();

const app = express();
const port = process.env.PORT ?? 3000;

connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(decryptRequestBody);
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (_req, res) => {
  res.send(`API is working wait plz`);
});

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/statistics", statistics);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is running on this port  number ${port}`);
});
