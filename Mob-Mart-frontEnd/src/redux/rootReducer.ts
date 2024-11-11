import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { userReducer } from "./reducer/userReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userReducer"],
};

const rootReducer = combineReducers({
  userReducer: userReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
