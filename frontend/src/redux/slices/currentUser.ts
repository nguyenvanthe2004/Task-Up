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

export const { setCurrentUser, logout, addWorkspace } = currentUserSlice.actions;
export default currentUserSlice.reducer;
