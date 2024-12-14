import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserDashboard = createAsyncThunk(
    "userDashboard/fetchUserDashboard",
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await axios.get(
                `${BASE_URL}/api/auth/user-dashboard-readings/${userId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "6024",
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }
);

const userDashboardSlice = createSlice({
    name: "userDashboard",
    initialState: {
        totalBillAmount: 0,
        totalConsumption: 0,
        totalMeters: 0,
        chartData: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDashboard.fulfilled, (state, action) => {
                state.loading = false;
                const newData = action.payload;

                const totalAmount = newData.reduce(
                    (total, item) => total + item.bill_amount,
                    0
                );

                const totalConsumpUnit = newData.reduce(
                    (total, item) => total + item.consumption,
                    0
                );

                const meterNumbers = newData.map((item) => item.meter_number);
                const uniqueMeterNumbers = new Set(meterNumbers);
                const totalUniqueMeters = uniqueMeterNumbers.size;

                state.totalBillAmount = totalAmount;
                state.totalConsumption = totalConsumpUnit;
                state.totalMeters = totalUniqueMeters;
                state.chartData = newData;
            })
            .addCase(fetchUserDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userDashboardSlice.reducer;
