import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Make sure only Admin is allowed

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Login First", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("ID not Exists", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("can't logged in You're not an admin", 403));

  next();
});
