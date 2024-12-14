import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userDashboardReducer from "./slices/user/userDashboardSlice";
import readingsReducer from "./slices/user/readingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDashboard: userDashboardReducer,
    readings: readingsReducer,
  },
});