import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts
} from "../controllers/statistics.js";

const app = express.Router();

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/stats */
app.get("/stats", getDashboardStats);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/pie */
app.get("/pie", getPieCharts);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/bar */
app.get("/bar", getBarCharts);

/* COMPLETE URL IS http://localhost:7000/api/v1/statistics/line */
app.get("/line", getLineCharts);

export default app;
