import { tryCatch } from "../middlewares/error.js";
import { CouponModel } from "../models/couponModels.js";

import ErrorHandler from "../utils/utility-class.js";

export const newCoupon = tryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  console.log(req.body);

  if (!coupon || !amount) return next(new ErrorHandler("Please enter both coupon and amount", 400));

  const isDuplicate = new CouponModel({ coupon });

  if (isDuplicate) {
    return next(new ErrorHandler("Coupon already exists", 400));
  }

  await CouponModel.create({ coupon, amount });

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`
  });
});

export const applyDiscount = tryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  console.log(req.query, "LELE");

  const discount = await CouponModel.findOne({ coupon });

  if (!discount) return next(new ErrorHandler("Inavlid Coupon", 401));

  return res.status(200).json({
    success: true,
    discount: discount.amount
  });
});

export const getAllCoupons = tryCatch(async (req, res, next) => {
  const coupon = await CouponModel.find({});

  return res.status(200).json({
    success: true,
    coupon
  });
});

export const deleteCoupons = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await CouponModel.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.coupon} Deleted Successfully`
  });
});
