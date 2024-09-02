import { InvalidateCacheProps } from "../types/types.js";
import { myCache } from "../app.js";
import { ProductsModel } from "../models/products.js";

export const invalidateCache = async ({ product, order, admin }: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = ["latest-product", "all-products"];

    const products = await ProductsModel.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    myCache.del(productKeys);
  }
};
