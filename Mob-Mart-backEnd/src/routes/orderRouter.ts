import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrders,
  processOrder
} from "../controllers/orderControllers.js";

const app = express.Router();

/* COMPLETE URL IS http://localhost:7000/api/v1/orders/new */
app.post("/new", newOrders);

/* COMPLETE URL IS http://localhost:7000/api/v1/orders//my-orders */
app.get("/my-orders", myOrders);

/* COMPLETE URL IS  http://localhost:7000/api/v1/orders/all */
app.get("/all", adminOnly, allOrders);

/* COMPLETE URL IS  http://localhost:7000/api/v1/orders/id */
app.route("/:id").get(getSingleOrder).put(adminOnly, processOrder).delete(adminOnly, deleteOrder);

export default app;
