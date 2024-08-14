import express from "express";

import userRoutes from "./routes/userRouter.js";
import productRoutes from "./routes/productsRouter.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
const port = 7000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`API is working wait plz`);
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is running on this port  number ${port} `);
});
