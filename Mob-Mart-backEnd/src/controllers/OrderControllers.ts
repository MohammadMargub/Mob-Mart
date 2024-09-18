import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { OrderModel } from "../models/orderModel.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrders = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
    const { shippingInfo, orderItems, user, subTotal, tax, total, company, price } = req.body;

    if (!shippingInfo || !orderItems || !user || !subTotal || !tax || !total || !company || !price)
      return next(new ErrorHandler("Please Enter All Details", 400));

    const order = await OrderModel.create({
      shippingInfo,
      orderItems,
      user,
      tax,
      company,
      total,
      price
    });

    await reduceStock(orderItems);

    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId))
    });

    return res.status(200).json({
      success: true,
      message: "Order Placed Successfully"
    });
  }
);

export const processOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "In-Process":
      order.status = "Shipping";
      break;

    case "Shipping":
      order.status = "Shipping";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id)
  });
  return res.status(200).json({
    success: true,
    message: "Order Processsed Successfully"
  });
});

export const deleteOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id)
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully"
  });
});

export const myOrders = tryCatch(async (req, res, _next) => {
  const { id: user } = req.query;
  const key = `my-order - ${user}`;
  let orders = [];

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await OrderModel.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders
  });
});

export const allOrders = tryCatch(async (_req, res, _next) => {
  const key = `all-orders`;

  let orders = [];
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await OrderModel.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders
  });
});

export const getSingleOrder = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const key = `order = ${id}`;

  console.log(key, "KEY");

  let order;

  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await OrderModel.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    myCache.set(key, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order
  });
});
