import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { AllProductsResponse } from "../../types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => {
        return "latest";
      },
    }),
  }),
});

export const { userLatestProductsQuery } = productApi;
