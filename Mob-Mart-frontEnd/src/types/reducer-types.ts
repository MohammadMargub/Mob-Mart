import { User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}

export interface AllMobileReducerInitialState {
  mobile: string[];
  loading: boolean;
}
