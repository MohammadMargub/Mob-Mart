import { myCache } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/orderModel.js";
import { ProductsModel } from "../models/productsModel.js";
import { User } from "../models/userModel.js";

import { calculatePercentage, getInventories } from "../utils/features.js";

interface Order {
  createdAt: Date;
  total?: number;
}

export const getDashboardStats = tryCatch(async (_req, res, _next) => {
  let stats = {};

  if (myCache.has("admin-stats")) {
    stats = JSON.parse(myCache.get("admin-stats") as string);
  } else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0)
    };

    const thisMonthProductsPromise = ProductsModel.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end }
    });

    const lastMonthProductsPromise = ProductsModel.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end }
    });

    const thisMonthUserPromise = User.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end }
    });

    const lastMonthUserPromise = User.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end }
    });

    const thisMonthOrdersPromise = OrderModel.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end }
    });

    const lastMonthOrdersPromise = OrderModel.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end }
    });

    const lastSixMonthOrdersPromise = OrderModel.find({
      createdAt: { $gte: sixMonthsAgo, $lte: today }
    });

    const latestTransactionPromise = OrderModel.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthOrders,
      thisMonthProducts,
      thisMonthUsers,
      lastMonthUsers,
      lastMonthOrders,
      lastMonthProducts,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      companies,
      femaleUsersCount,
      latestTransaction
    ] = await Promise.all([
      thisMonthOrdersPromise,
      thisMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      lastMonthOrdersPromise,
      lastMonthProductsPromise,
      ProductsModel.countDocuments(),
      User.countDocuments(),
      OrderModel.find({}).select("total"),
      lastSixMonthOrdersPromise,
      ProductsModel.distinct("company"),
      User.countDocuments({ gender: "female" }),
      latestTransactionPromise
    ]);

    const productCompanies = await getInventories({ companies, productsCount });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount
    };

    const modifiedTransaction = latestTransaction.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status
    }));

    // Arrays to store counts and revenue for the last 6 months
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    // Loop over last six months' orders and calculate counts and revenue
    lastSixMonthOrders.forEach((order: Order) => {
      const creationDate = order.createdAt;
      const monthDiff =
        today.getMonth() -
        creationDate.getMonth() +
        (today.getFullYear() - creationDate.getFullYear()) * 12;

      if (monthDiff < 6) {
        orderMonthCounts[5 - monthDiff] += 1;
        orderMonthRevenue[5 - monthDiff] += order.total ?? 0;
      }
    });

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total: number, order: Order) => total + (order.total ?? 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total: number, order: Order) => total + (order.total ?? 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
    };

    stats = {
      companiesCount: productCompanies,
      changePercent,
      count: {
        revenue: allOrders.reduce((total: number, order: Order) => total + (order.total ?? 0), 0),
        user: usersCount,
        product: productsCount,
        order: allOrders.length,
        companies: companies.length
      },
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue
      },
      userRatio,
      latestTransaction: modifiedTransaction
    };

    myCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats
  });
});

export const getPieCharts = tryCatch(async (_req, res, _next) => {
  let charts;
  if (myCache.has("admin-pie-charts")) {
    charts = JSON.parse(myCache.get("admin-pie-charts") as string);
  } else {
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      productsCount,
      outOfStock,
      companies,
      allOrders,
      allUsers
    ] = await Promise.all([
      OrderModel.countDocuments({ status: "Processing" }),
      OrderModel.countDocuments({ status: "In-Process" }),
      OrderModel.countDocuments({ status: "Delivered" }),
      ProductsModel.countDocuments(),
      ProductsModel.countDocuments({ stock: { $lte: 0 } }),
      ProductsModel.distinct("company"),
      OrderModel.find({}, "total discount tax shippingInfo"),
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" })
    ]);

    // Calculate gross income, total discount, and burnt tax
    const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
    const totalDiscount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin = grossIncome - discount - burnt - productionCost - marketingCost;

    const productCompanies = await getInventories({ companies, productsCount });

    const stockAvailability = {
      inStock: productsCount - outOfStock,
      outOfStock
    };

    const orderFulfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder
    };

    const revenueDistribution = {
      netMargin: netMargin,
      discount: totalDiscount,
      productionCost: productionCost,
      burnt,
      marketingCost: marketingCost
    };

    charts = {
      orderFulfillment,
      productCompanies,
      stockAvailability,
      revenueDistribution
    };

    myCache.set("admin-pie-charts", JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts
  });
});

export const getBarCharts = tryCatch(async (_req, _res, _next) => {});

export const getLineCharts = tryCatch(async (_req, _res, _next) => {});
