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
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type orderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type shippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: {};
  user: string;
  price: number;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: orderItemType[];
  company: string;
}

export type ControllerType = (
  req: Request<Record<string, unknown>>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<unknown, Record<string, unknown>>>;
