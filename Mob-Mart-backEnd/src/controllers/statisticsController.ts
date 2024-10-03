import { myCache } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/orderModel.js";
import { ProductsModel } from "../models/productsModel.js";
import { User } from "../models/userModel.js";
import { MyDocument } from "../types/types.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";

interface Order {
  createdAt: Date;
  total?: number;
}

export const getDashboardStats = tryCatch(async (_req, res, _next) => {
  let stats = {};

  const key = "admin-stats";

  if (myCache.has(key)) {
    stats = JSON.parse(myCache.get(key) as string);
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
      const monthDiff = (today.getFullYear() - creationDate.getFullYear() + 12) % 12;

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

    myCache.set(key, JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats
  });
});

export const getPieCharts = tryCatch(async (_req, res, _next) => {
  let charts;
  let key = "admin-pie-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      productsCount,
      outOfStock,
      companies,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers
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
      (prev, order) => prev + (order.shippingCharges ?? 0),
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

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers
    };
    const calculateAge = (dob: Date) => {
      const dobDate = new Date(dob);
      const ageDiff = new Date().getTime() - dobDate.getTime();
      return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
    };

    const usersAgeGroup = {
      teen: allUsers.filter((user) => {
        const age = calculateAge(user.dob);
        return age >= 18 && age <= 24;
      }).length,
      adult: allUsers.filter((user) => {
        const age = calculateAge(user.dob);
        return age >= 25 && age <= 40;
      }).length,
      old: allUsers.filter((user) => {
        const age = calculateAge(user.dob);
        return age >= 41 && age <= 90;
      }).length
    };

    charts = {
      orderFulfillment,
      productCompanies,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts
  });
});

export const getBarCharts = tryCatch(async (_req, res, _next) => {
  let charts;
  const key = "admin-bar-charts";
  const today = new Date();

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthOrdersPromise = OrderModel.find({
      createdAt: { $gte: sixMonthsAgo, $lte: today }
    }) as Promise<MyDocument[]>;

    const sixMonthProductsPromise = ProductsModel.find({
      createdAt: { $gte: twelveMonthsAgo, $lte: today }
    }) as Promise<MyDocument[]>;

    const sixMonthUsersPromise = User.find({
      createdAt: { $gte: sixMonthsAgo, $lte: today }
    }).select("createdAt") as Promise<MyDocument[]>;

    const [sixMonthOrders, sixMonthUsers, sixMonthProducts] = await Promise.all([
      sixMonthOrdersPromise,
      sixMonthUsersPromise,
      sixMonthProductsPromise
    ]);

    const productCounts = getChartData({
      length: 6,
      today,
      docArr: sixMonthProducts
    });
    const userCounts = getChartData({ length: 6, today, docArr: sixMonthUsers });
    const ordersCounts = getChartData({ length: 6, today, docArr: sixMonthOrders });

    charts = {
      products: productCounts,
      users: userCounts,
      orders: ordersCounts
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    data: charts
  });
});

export const getLineCharts = tryCatch(async (_req, res, _next) => {
  const key = "admin-line-charts";
  const today = new Date();
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(today.getMonth() - 12);

  let charts;

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    try {
      const twelveMonthUserPromise = User.find({
        createdAt: { $gte: twelveMonthsAgo, $lte: today }
      }) as Promise<MyDocument[]>;

      const twelveMonthOrderPromise = OrderModel.find({
        createdAt: { $gte: twelveMonthsAgo, $lte: today }
      }) as Promise<MyDocument[]>;

      const twelveMonthProductPromise = ProductsModel.find({
        createdAt: { $gte: twelveMonthsAgo, $lte: today }
      }) as Promise<MyDocument[]>;

      const [twelveMonthUser, twelveMonthOrders, twelveMonthProducts] = await Promise.all([
        twelveMonthUserPromise,
        twelveMonthOrderPromise,
        twelveMonthProductPromise
      ]);

      const usersCounts = getChartData({ length: 12, today, docArr: twelveMonthUser });

      const ordersCounts = getChartData({
        length: 12,
        today,
        docArr: twelveMonthOrders
      });

      const productsCounts = getChartData({
        length: 12,
        today,
        docArr: twelveMonthProducts
      });

      const discountData = getChartData({
        length: 12,
        today,
        docArr: twelveMonthOrders,
        property: "discount"
      });

      const revenueData = getChartData({
        length: 12,
        today,
        docArr: twelveMonthOrders,
        property: "total"
      });

      charts = {
        users: usersCounts,
        orders: ordersCounts,
        products: productsCounts,
        discount: discountData,
        revenue: revenueData
      };

      myCache.set(key, JSON.stringify(charts));
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch data"
      });
    }
  }

  return res.status(200).json({
    success: true,
    data: charts
  });
});
