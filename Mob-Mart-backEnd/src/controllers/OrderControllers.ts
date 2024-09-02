import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";

export const newOrders = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, _next: NextFunction) => {}
);
