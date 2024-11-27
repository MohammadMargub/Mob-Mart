import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
  user: null,
  loading: false,
  _id: undefined,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User | null>) => {
      state.loading = false;
      state.user = action.payload ? action.payload : null;
    },
    userLogout: (state) => {
      state.user = null;
      state._id = undefined;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});
export const { userExist, userLogout, setLoading } = userReducer.actions;
