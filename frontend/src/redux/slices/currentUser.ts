import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUserState, User } from "../../types/auth";

const initialState: CurrentUserState = {
  currentUser: {
    userId: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  },
};

export const currentUserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = {
        userId: "",
        fullName: "",
        email: "",
        phone: "",
        role: "",
        avatar: "",
      };
    },
  },
});

export const { setCurrentUser, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
