import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userDashboardReducer from "./slices/user/userDashboardSlice";
import readingsReducer from "./slices/user/readingsSlice";
import dashboardReducer from "./slices/admin/dashboardSlice";
import chartReducer from "./slices/admin/chartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userDashboard: userDashboardReducer,
    readings: readingsReducer,
    dashboard: dashboardReducer,
    chart: chartReducer,
  },
});