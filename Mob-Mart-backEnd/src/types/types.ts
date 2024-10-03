import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  photo: string;
  price: number;
  stocks: number;
  company: string;
  id: string;
}

export type SearchRequestQuery = {
  company?: string;
  page?: string;
  price?: number;
  search?: string;
  sort?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };

  price?: {
    $lte: number;
  };
  company?: string;
}

export type InvalidateCacheProps = {
  admin?: boolean;
  order?: boolean;
  orderId?: string;
  product?: boolean;
  productId?: string | string[];
  userId?: string;
};

export type orderItemType = {
  name: string;
  photo: string;
  price: number;
  productId: string;
  quantity: number;
};

export type shippingInfoType = {
  address: string;
  city: string;
  country: string;
  pincode: number;
  state: string;
};

export interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
export type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export interface Iuser extends Document {
  _id: string;
  name: string;
  photo: string;
  email: string;
  role: "admin" | "user";
  gender: "Male " | "Female" | "Trans";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  age: number;
}

export interface NewOrderRequestBody {
  company: string;
  createdAt: Date;
  discount: number;
  orderItems: orderItemType[];
  price: number;
  shippingCharges: number;
  shippingInfo: {};
  subTotal: number;
  tax: number;
  total: number;
  user: string;
  today: Date;
}

export type ControllerType = (
  req: Request<Record<string, unknown>>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<unknown, Record<string, unknown>>>;
