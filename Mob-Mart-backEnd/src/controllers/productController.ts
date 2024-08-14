import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { ProductsModel } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const createProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const { name, price, stocks, company } = req.body;

    console.log("lll", name, price, stocks, company);

    const photo = req.file;
    console.log(photo);

    if (!photo) return next(new ErrorHandler("Please add a photo", 400));
    if (!name || !price || !stocks || !photo || !company) {
      rm(photo.path, () => {
        console.log("Deleted");
        return next(new ErrorHandler("Please Enter All Fields", 400));
      });
    }
    await ProductsModel.create({
      name,
      price,
      stocks,
      photo: photo.path,
      company
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully"
    });
  }
);

export const getLatestProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const products = await ProductsModel.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      products
    });
  }
);

export const getProductCategory = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const categories = await ProductsModel.distinct("category");

    return res.status(200).json({
      success: true,
      categories
    });
  }
);

export const getAdminProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const products = await ProductsModel.find({});

    return res.status(200).json({
      success: true,
      products
    });
  }
);

export const getSingleProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const product = await ProductsModel.findById(req.params.id);

    if (!product) return next(new ErrorHandler("Product Not found", 404));

    return res.status(200).json({
      success: true,
      product
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stocks, company, category } = req.body;
  console.log("Line number 86", name, price, stocks, company, category);

  const photo = req.file;
  const product = await ProductsModel.findById(id);
  console.log(photo);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
      return next(new ErrorHandler("Please Enter All Fields", 400));
    });

    if (name) product.name = name;
    if (price) product.price = price;
    if (stocks) product.stocks = stocks;
    if (company) product.company = company;

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully"
    });
  }
});

export const deleteProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const product = await ProductsModel.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    rm(product.photo!, () => {
      console.log("Old Photo Deleted Successfully");
    });
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      product
    });
  }
);
