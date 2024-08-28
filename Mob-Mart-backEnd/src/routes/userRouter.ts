import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/userController.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// Create New user Route
app.post("/new", newUser);

// get all user Route
app.get("/all", adminOnly, getAllUsers);

// get user by the ID Route
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default app;
