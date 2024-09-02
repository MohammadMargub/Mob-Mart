import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const schema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: [true, "Please Enter ID"],
      unique: true,
      default: uuidv4
    },

    name: {
      type: String,
      required: [true, "Please Enter Name"]
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"]
    },
    price: {
      type: String,
      required: [true, "Please add Price"]
    },
    stocks: {
      type: Number,
      required: [true, "Please add Stocks"]
    },
    company: {
      type: String,
      required: [true, "Please add Company Name"]
    },
    country: {
      type: String,
      required: [true, "Please add country Name"]
    },
    State: {
      type: String,
      required: [true, "Please add State"]
    },
    City: {
      type: String,
      required: [true, "Please add a City Name"]
    },
    shipping_chargres: {
      type: Number,
      required: [true, "Please add Shipping Charges"]
    },
    discount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["In-Process", "Shipping", "Delivered"],
      default: "In-Process"
    },
    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product"
        }
      }
    ]
  },

  {
    timestamps: true
  }
);

export const OrderModel = mongoose.model("OrderModel", schema);
