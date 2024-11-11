import { User } from "./types";

export interface UserReducerInitialState {
  _id: any;
  user: User | null;
  loading: boolean;
}

export interface AllMobileReducerInitialState {
  mobile: string[];
  loading: boolean;
}
