import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { useReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [useReducer.name]: useReducer.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
