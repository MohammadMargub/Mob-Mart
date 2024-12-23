import { rm } from "fs";
import { Request, Response, NextFunction } from "express";
import { tryCatch } from "../middlewares/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { ProductsModel } from "../models/productsModel.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const createProduct = tryCatch(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("Please add a photo", 400));
  }

  const { name, price, stocks, company } = req.body;

  if (!name || !price || !stocks || !company) {
    rm(req.file.path, () => {
      return next(new ErrorHandler("Please Enter All Fields", 400));
    });
    return;
  }

  const imagePath = `/uploads/${req.file.filename}`;

  await ProductsModel.create({
    name,
    price,
    stocks,
    photo: imagePath,
    company
  });

  await invalidateCache({ product: true, admin: true });

  return res.status(201).json({
    success: true,
    message: "ProductsModel Created Successfully"
  });
});

export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stocks, company } = req.body;
  const photo = req.file;

  const product = await ProductsModel.findById(id);
  if (!product) {
    return next(new ErrorHandler("ProductsModel Not Found", 404));
  }

  if (
    name === undefined &&
    price === undefined &&
    stocks === undefined &&
    company === undefined &&
    !photo
  ) {
    return next(
      new ErrorHandler("At least one field or a new photo is required to update the product.", 400)
    );
  }

  if (name !== undefined) {
    product.name = name;
  }
  if (price !== undefined) {
    product.price = price;
  }
  if (stocks !== undefined) {
    product.stocks = stocks;
  }
  if (company !== undefined) {
    product.company = company;
  }

  if (photo) {
    rm(product.photo, (err) => {
      if (err) {
        return next(new ErrorHandler("Error deleting old photo", 500));
      }
    });

    product.photo = photo.filename;
  }

  await product.save();

  await invalidateCache({ product: true, productId: String(product._id), admin: true });

  return res.status(200).json({
    success: true,
    message: "ProductsModel Updated Successfully",
    product
  });
});

export const deleteProduct = tryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const product = await ProductsModel.findById((req.params as any).id);
    if (!product) {
      return next(new ErrorHandler("ProductsModel Not Found", 404));
    }
    rm(product.photo, () => {
      console.log("Old Photo Deleted Successfully");
    });
    await product.deleteOne();
    await invalidateCache({ product: true, productId: String(product._id), admin: true });

    return res.status(200).json({
      success: true,
      message: "ProductsModel Deleted Successfully"
    });
  }
);

export const getLatestProduct = tryCatch(
  async (_req: Request<{}, {}, NewProductRequestBody>, res: Response, _next: NextFunction) => {
    let products;

    if (myCache.has("latest-product")) {
      products = JSON.parse(myCache.get("latest-product")!);
    } else {
      products = await ProductsModel.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5);
      myCache.set("latest-product", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products
    });
  }
);

export const getProductCategory = tryCatch(
  async (_req: Request<{}, {}, NewProductRequestBody>, res: Response, _next: NextFunction) => {
    const categories = await ProductsModel.distinct("company");

    return res.status(200).json({
      success: true,
      categories
    });
  }
);

export const getAdminProducts = tryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    let products;

    if (myCache.has("all-products")) {
      products = JSON.parse(myCache.get("all-products") as string);
    } else {
      const products = await ProductsModel.find({});
      myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
      success: true,
      products
    });
  }
);

export const getSingleProduct = tryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    product = await ProductsModel.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    myCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product
  });
});

export const getAllProducts = tryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res: Response, _next: NextFunction) => {
    const { company, price, search, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (price && !isNaN(Number(price))) {
      baseQuery.price = { $lte: Number(price) };
    }

    if (company) {
      baseQuery.company = company;
    }

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i"
      };
    }

    const productsPromise = ProductsModel.find(baseQuery)
      .sort(sort ? { price: sort === "asc" ? 1 : -1 } : {})
      .limit(limit)
      .skip(skip);

    const [products, filteredProductOnly] = await Promise.all([
      productsPromise,
      ProductsModel.find(baseQuery)
    ]);

    const totalPage = Math.ceil(filteredProductOnly.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage
    });
  }
);

export const getAllMobile = tryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const mobileCompanies = [
      "Apple",
      "Samsung",
      "Xiaomi",
      "OnePlus",
      "Oppo",
      "Vivo",
      "Huawei",
      "Google"
    ];

    return res.status(200).json({
      success: true,
      mobileCompanies
    });
  }
);
