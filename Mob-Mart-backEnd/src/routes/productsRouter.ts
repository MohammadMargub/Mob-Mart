import express from "express";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getLatestProduct,
  getProductCategory,
  getSingleProduct,
  updateProduct
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// product create route API Sample  http://localhost:7000/api/v1/products/End point in all of this which you wanted to add

app.post("/new", adminOnly, singleUpload, createProduct);

app.get("/latest", getLatestProduct);

app.get("/categories", getProductCategory);

app.get("/admin-products", getAdminProducts);

app.route(":/id").get(getSingleProduct).put(singleUpload, updateProduct).delete(deleteProduct);

export default app;
