import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllMobile,
  getAllProducts,
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

app.get("/admin-products", getAllProducts);

app.get("/all", getAllProducts);

app.get("/all-mobile", getAllMobile);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
