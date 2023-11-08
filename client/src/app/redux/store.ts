import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import { rootReducer } from "./rootReducer";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;