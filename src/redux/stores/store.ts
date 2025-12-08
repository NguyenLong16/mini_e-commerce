import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slices/paginationSlice"
import authReducer from "../slices/authSlice"

export const store = configureStore({
    reducer: {
        products: productReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

