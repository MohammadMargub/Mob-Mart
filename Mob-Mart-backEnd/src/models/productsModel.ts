import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter ID"],
      unique: true,
      default: () => new mongoose.Types.ObjectId()
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

    id: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const ProductsModel = mongoose.model("ProductsModel", schema);
