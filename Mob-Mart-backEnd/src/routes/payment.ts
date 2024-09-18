import express from "express";
import {
  applyDiscount,
  deleteCoupons,
  getAllCoupons,
  newCoupon
} from "../controllers/paymentController.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

/* http://localhost:7000/api/v1/payment/discount */
app.get("/coupon/all", adminOnly, getAllCoupons);

/* http://localhost:7000/api/v1/payment/coupon/new */
app.post("/coupon/new", adminOnly, newCoupon);

/* http://localhost:7000/api/v1/payment/discount */
app.get("/discount", applyDiscount);

/* http://localhost:7000/api/v1/payment/delete/coupon/_id */
app.delete("/coupon/:id", adminOnly, deleteCoupons);

export default app;
