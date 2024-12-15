import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("userToken");

export const fetchUsersChartData = createAsyncThunk(
    "chart/fetchUsersChartData",
    async (_, { rejectWithValue }) => {
        try {
            const [monthlyUserRes, yearlyUserRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/auth/monthly-user-chart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`${BASE_URL}/api/auth/yearly-user-chart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            return {
                monthly: monthlyUserRes.data.monthlyData,
                yearly: yearlyUserRes.data.yearlyData,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch user data.");
        }
    }
);

export const fetchConsumptionChartData = createAsyncThunk(
    "chart/fetchConsumptionChartData",
    async (_, { rejectWithValue }) => {
        try {
            const [monthlyConsumptionRes, yearlyConsumptionRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/auth/monthly-consumption-chart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`${BASE_URL}/api/auth/yearly-consumption-chart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            return {
                monthly: monthlyConsumptionRes.data.monthlyData,
                yearly: yearlyConsumptionRes.data.yearlyData,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch consumption data.");
        }
    }
);

const chartSlice = createSlice({
    name: "chart",
    initialState: {
        usersData: [{ monthly: null, yearly: null }],
        consumptionData: [{ monthly: null, yearly: null }],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersChartData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersChartData.fulfilled, (state, action) => {
                state.usersData = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsersChartData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchConsumptionChartData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsumptionChartData.fulfilled, (state, action) => {
                state.consumptionData = action.payload;
                state.loading = false;
            })
            .addCase(fetchConsumptionChartData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default chartSlice.reducer;
