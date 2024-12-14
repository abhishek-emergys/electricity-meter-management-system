import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMeterReadings = createAsyncThunk(
    "readings/fetchMeterReadings",
    async (userId, { rejectWithValue }) => {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("userToken");

        try {
            const response = await axios.get(`${BASE_URL}/api/auth/user-dashboard-readings/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.data || [];
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const readingsSlice = createSlice({
    name: "readings",
    initialState: {
        meterReadings: [],
        filteredMeterReadings: [],
        loading: false,
        error: null,
    },
    reducers: {
        filterReadings: (state, action) => {
            const { query, meter } = action.payload;

            state.filteredMeterReadings = state.meterReadings.filter((reading) =>
                (reading.meter_number && reading.meter_number.toLowerCase().includes(query.toLowerCase())) ||
                reading.user_id.toString().includes(query)
            );

            if (meter !== "All") {
                state.filteredMeterReadings = state.filteredMeterReadings.filter(
                    (reading) => reading.meter_number === meter
                );
            }
        },
        sortReadings: (state, action) => {
            const { key, direction } = action.payload;

            if (!key || !direction) {
                state.filteredMeterReadings = [...state.meterReadings];
                return;
            }

            state.filteredMeterReadings = [...state.filteredMeterReadings].sort((a, b) => {
                const aValue = a[key]?.toString().toLowerCase() || "";
                const bValue = b[key]?.toString().toLowerCase() || "";

                if (aValue < bValue) {
                    return direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeterReadings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMeterReadings.fulfilled, (state, action) => {
                state.loading = false;
                state.meterReadings = action.payload;
                state.filteredMeterReadings = action.payload;
            })
            .addCase(fetchMeterReadings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch readings.";
            });
    },
});

export const { filterReadings, sortReadings } = readingsSlice.actions;
export default readingsSlice.reducer;
