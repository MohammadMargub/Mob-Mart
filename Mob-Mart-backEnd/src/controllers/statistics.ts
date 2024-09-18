import { myCache } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/orderModel.js";
import { ProductsModel } from "../models/productsModel.js";
import { User } from "../models/userModel.js";
import { calculatePercentage } from "../utils/features.js";
import { allOrders } from "./orderControllers.js";

export const getDashboardStats = tryCatch(async (_req, res, _next) => {
  let stats = {};
  if (myCache.has("admin-stats")) {
    stats = JSON.parse(myCache.get("admin-stats") as string);
  } else {
    const today = new Date();

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0)
    };

    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

    const endOfThisMonth = today;

    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthProductsPromise = ProductsModel.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end
      }
    });

    const lastMonthProductsPromise = ProductsModel.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end
      }
    });

    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end
      }
    });

    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end
      }
    });

    const thisMonthOrdersPromise = OrderModel.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end
      }
    });

    const lastMonthOrdersPromise = OrderModel.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end
      }
    });

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthUser,
      lastMonthOrders,
      lastMonthProducts,
      productsCount,
      usersCount,
      allOrders
    ] = await Promise.all([
      thisMonthOrdersPromise,
      thisMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      lastMonthOrdersPromise,
      lastMonthProductsPromise,
      ProductsModel.countDocuments(),
      User.countDocuments(),
      OrderModel.find({}).select("total")
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, orderModel) => total + (orderModel.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, orderModel) => total + (orderModel.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUser.length),
      order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
    };

    const productChangePercentage = calculatePercentage(
      thisMonthProducts.length,
      lastMonthProducts.length
    );

    const userChangePercentage = calculatePercentage(thisMonthUsers.length, lastMonthUser.length);

    const orderChangePercentage = calculatePercentage(
      thisMonthOrders.length,
      lastMonthOrders.length
    );

    stats = { changePercent };
  }

  // const revenue = allOrders.reduce(
  //   (total: any, orderModel: { total: any }) => total + (orderModel.total || 0),
  //   0
  // );

  // const count = {
  //   revenue,
  //   user: usersCount,
  //   product: productsCount,
  //   order: allOrders.length
  // };

  return res.status(200).json({
    success: true,
    stats
  });
});

export const getPieCharts = tryCatch(async (_req, _res, _next) => {});

export const getBarCharts = tryCatch(async (_req, _res, _next) => {});

export const getLineCharts = tryCatch(async (_req, _res, _next) => {});
