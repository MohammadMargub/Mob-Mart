import { InvalidateCacheProps, orderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { ProductsModel } from "../models/productsModel.js";

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = ["latest-product", "all-products", `product-${productId}`];

    if (typeof productId === "string") {
      productKeys.push(`Prouct- ${productId}`);
    }

    if (typeof productId === "object") {
      productId.forEach((i) => {
        productKeys.push(`Product - ${i}`);
        console.log("LOL");
      });
    }

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = ["all-orders", `My Orders-${userId}`, `order- ${orderId}`];

    myCache.del(orderKeys);
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (const orderItem of orderItems) {
    const product = await ProductsModel.findById(orderItem.productId);

    if (!product) {
      throw new Error(`Product Not Found for order item: ${orderItem.productId}`);
    }

    product.stocks -= orderItem.quantity;

    if (product.stocks < 0) {
      throw new Error(
        `Insufficient Stock for product: ${product.name} (ID: ${product.product_id})`
      );
    }

    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) {
    return thisMonth * 100;
  }

  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  companies,
  productsCount
}: {
  companies: string[];
  productsCount: number;
}) => {
  const companiesCount = await Promise.all(
    companies.map((companyName: string) => ProductsModel.countDocuments({ companyName }))
  );

  const companyCount: { companyName: string; count: number; percentage: number }[] = [];

  companies.forEach((company, i) => {
    const count = companiesCount[i] || 0;
    const percentage = productsCount > 0 ? (count / productsCount) * 100 : 0;
    companyCount.push({ companyName: company, count, percentage });
  });

  return companyCount;
};
