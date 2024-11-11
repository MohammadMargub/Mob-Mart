import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { userAPI } from "./api/userAPI";
import { productAPI } from "./api/productAPI";
import { userReducer } from "./reducer/userReducer";
import { persistReducer, persistStore } from "redux-persist";
import { createLogger } from "redux-logger";

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
};

const logger = createLogger();

const persistedUserReducer = persistReducer(persistConfig, userReducer.reducer);

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      productAPI.middleware,
      logger
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
