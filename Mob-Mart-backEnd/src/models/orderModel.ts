import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter ID"],
      default: () => new mongoose.Types.ObjectId(), // This will generate a MongoDB ObjectId
      unique: true
    },

    name: {
      type: String
    },

    price: {
      type: String,
      required: [true, "Please add Price"]
    },

    company: {
      enum: ["Apple", "Samsung", "Xiaomi", "OnePlus", "Oppo", "Vivo", "Huawei", "Google"],
      type: String,
      required: [true, "Please add Company Name"]
    },

    discount: {
      type: Number,
      default: 0
    },

    user: {
      type: String,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["In-Process", "Shipping", "Delivered"],
      default: "In-Process"
    },

    tax: {
      type: Number,
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    subTotal: {
      type: Number
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
    ],

    shippingCharges: {
      type: Number
    },

    shippingInfo: {
      address: {
        type: String,
        required: true
      },

      city: {
        type: String,
        required: true
      },

      state: {
        type: String,
        required: true
      },

      country: {
        type: String,
        required: true
      },

      pinCode: {
        type: Number,
        required: true
      }
    }
  },

  {
    timestamps: true
  }
);

export const OrderModel = mongoose.model("OrderModel", schema);
