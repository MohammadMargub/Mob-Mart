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
};

export interface NewOrderRequestBody {}

export type ControllerType = (
  req: Request<Record<string, unknown>>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<unknown, Record<string, unknown>>>;
