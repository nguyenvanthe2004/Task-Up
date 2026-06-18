import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUserState, User } from "../../types/auth";
import { Workspace } from "../../types/workspace";

const initialState: CurrentUserState = {
  currentUser: {
    id: 0,
    fullName: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    workspaces: [],
  },
  isLogout: false,
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
        id: 0,
        fullName: "",
        email: "",
        phone: "",
        role: "",
        avatar: "",
      };
    },
    setIsLogout: (state, action: PayloadAction<boolean>) => {
      state.isLogout = action.payload;
    },
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      if (state.currentUser) {
        state.currentUser.workspaces = [
          ...(state.currentUser.workspaces ?? []),
          action.payload,
        ];
      }
    },
  },
});

export const { setCurrentUser, logout, setIsLogout, addWorkspace } =
  currentUserSlice.actions;
export default currentUserSlice.reducer;
