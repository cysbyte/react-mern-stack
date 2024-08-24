import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
    reducer: {
        users: userReducer
    }
});

export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch