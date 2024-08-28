import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { myCache } from "../app.js";
import { ProductsModel } from "../models/products.js";

// export const connectDB = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/", {
//       dbName: "Mob-Mart"
//     })
//     .then((c) => console.log(`DB connceted to ${c.connection.host}`))
//     .catch((e) => console.log(e));
// };

export const invalidateCache = async ({ product, order, admin }: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = ["latest-product", "all-products"];

    const products = await ProductsModel.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    myCache.del(productKeys);
  }
  if (order) {
  }
  if (admin) {
  }
};
