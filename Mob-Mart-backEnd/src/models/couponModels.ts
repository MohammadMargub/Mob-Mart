import mongoose from "mongoose";

const schema = new mongoose.Schema({
  coupon: {
    type: String,
    required: [true, "Please Enter the Cupon Code"]
  },
  amount: {
    type: Number,
    required: [true, "Please Enter the Discount Amount"]
  }
});

export const CouponModel = mongoose.model("Coupon", schema);
