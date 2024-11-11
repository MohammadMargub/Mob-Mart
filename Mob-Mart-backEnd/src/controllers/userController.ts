import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "../middlewares/error.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, photo, gender, _id, dob } = req.body;

  console.log(name, email, photo, gender, _id, dob);

  const requiredFields = { name, email, photo, gender, _id, dob };

  const missingField = Object.entries(requiredFields).find(([, value]) => !value);

  if (missingField) {
    return next(new ErrorHandler(`Missing field: ${missingField[0]}`, 400));
  }

  try {
    let user = await User.findById(_id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
        user
      });
    }

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob)
    });

    console.log(`User created`, user);

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
      user
    });
  } catch (error) {
    return next(new ErrorHandler("Error creating user", 500));
  }
};

// export const newUser = async (
//   req: Request<{}, {}, NewUserRequestBody>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { name, email, photo, gender, _id, dob } = req.body;

//   console.log(name, email, photo, gender, _id, dob);

//   const requiredFields: Record<string, unknown> = { name, email, photo, gender, _id, dob };

//   for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
//     if (!fieldValue) {
//       return next(new ErrorHandler(`Missing field: ${fieldName}`, 400));
//     }
//   }

//   // let user = await User.findById(_id);

//   // if (user) {
//   //   return res.status(200).json({
//   //     success: true,
//   //     message: `Welcome, ${user.name}`,
//   //     user
//   //   });
//   // }
//   let user = await User.findById(_id);

//   user = await User.create({
//     name,
//     email,
//     photo,
//     gender,
//     _id,
//     dob: new Date(dob)
//   });

//   console.log(`User created`, user);
//   return res.status(201).json({
//     success: true,
//     message: `Welcome, ${user.name}`,
//     user
//   });
// };

export const getAllUsers = tryCatch(async (_req, res, _next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users
  });
});

export const getUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById({ _id: id });

  if (!user) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  return res.status(200).json({
    success: true,
    user
  });
});

export const deleteUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  });
});
