import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllMobileCompanyResponse,
  AllProductsResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductsRequest,
  SearchProductsResponse,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, void>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductsResponse, string | number>({
      query: (id) => `admin-products?id=${id}`,
    }),
    allMobile: builder.query<AllMobileCompanyResponse, void>({
      query: () => `all-mobile`,
    }),
    categories: builder.query<CategoriesResponse, void>({
      query: () => `categories`,
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, company, page, search, sort }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (company) base += `&company=${company}`;
        if (sort) base += `&sort=${sort}`;

        return base;
      },
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        // url: `new?id=ABC-123`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useAllMobileQuery,
  useNewProductMutation,
} = productAPI;
