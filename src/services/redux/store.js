import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userDashboardReducer from "./slices/user/userDashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDashboard: userDashboardReducer,
  },
});