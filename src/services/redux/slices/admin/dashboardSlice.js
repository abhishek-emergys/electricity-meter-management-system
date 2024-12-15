import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("userToken");

export const fetchTotalUsers = createAsyncThunk(
    "userDashboard/fetchTotalUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/admin-getAllUsers`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "6024",
                },
            });
            return response.data.users.length;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTotalConsumption = createAsyncThunk(
    "userDashboard/fetchTotalConsumption",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/yearly-consumption-chart`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "6024",
                },
            });
            const total = response.data.yearlyData.reduce(
                (acc, data) => acc + data.totalConsumption,
                0
            );
            return total;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTotalMeters = createAsyncThunk(
    "userDashboard/fetchTotalMeters",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/yearly-meter-chart`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "6024",
                },
            });
            const total = response.data.yearlyData.reduce(
                (acc, data) => acc + data.totalMeters,
                0
            );
            return total;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const uploadCSVFile = createAsyncThunk(
    "dashboard/uploadCSVFile",
    async ({ file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`${BASE_URL}/api/auth/upload-csv`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.validationErrors?.length > 0) {
                return rejectWithValue("Validation failed. Please check your file.");
            }

            return "File successfully uploaded!";
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "An error occurred during the upload."
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        totalUsers: 0,
        totalConsumption: 0,
        totalMeters: 0,
        loading: false,
        error: null,
        uploadSuccessMessage: null,
    },
    reducers: {
        clearUploadMessage: (state) => {
            state.uploadSuccessMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTotalUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTotalUsers.fulfilled, (state, action) => {
                state.totalUsers = action.payload;
                state.loading = false;
            })
            .addCase(fetchTotalUsers.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addCase(fetchTotalConsumption.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTotalConsumption.fulfilled, (state, action) => {
                state.totalConsumption = action.payload;
                state.loading = false;
            })
            .addCase(fetchTotalConsumption.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addCase(fetchTotalMeters.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTotalMeters.fulfilled, (state, action) => {
                state.totalMeters = action.payload;
                state.loading = false;
            })
            .addCase(fetchTotalMeters.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addCase(uploadCSVFile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadSuccessMessage = null;
            })
            .addCase(uploadCSVFile.fulfilled, (state, action) => {
                state.uploadSuccessMessage = action.payload;
                state.loading = false;
            })
            .addCase(uploadCSVFile.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { clearUploadMessage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
