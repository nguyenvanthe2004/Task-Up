import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slices/currentUser";

export const store = configureStore({
    reducer: {
        auth: currentUserReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
