import express from "express";
import { newOrders } from "../controllers/OrderControllers.js";

const app = express.Router();

app.post("new", newOrders);

export default app;
