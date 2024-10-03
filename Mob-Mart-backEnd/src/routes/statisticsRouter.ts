import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts
} from "../controllers/statisticsController.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/stats */
app.get("/stats", adminOnly, getDashboardStats);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/pie */
app.get("/pie", adminOnly, getPieCharts);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/bar */
app.get("/bar", adminOnly, getBarCharts);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/line */
app.get("/line", getLineCharts);

export default app;
