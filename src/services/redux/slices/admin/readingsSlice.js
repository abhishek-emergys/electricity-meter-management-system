import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("userToken");

export const addReading = createAsyncThunk(
    'readings/addReading',
    async ({ userId, meterNumber, readingData, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/auth/admin-add-meter-reading/${userId}/${meterNumber}`,
                readingData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const assignMeter = createAsyncThunk(
    "meter/assign",
    async ({ formData, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/auth/admin-create-meter-reading/${userId}`,
                {
                    consumption: formData.consumption,
                    meter_number: formData.meter_number,
                    reading_date: formData.reading_date,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const readingsSlice = createSlice({
    name: 'readings',
    initialState: {
        isLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addReading.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addReading.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(addReading.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(assignMeter.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addReading.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(addReading.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default readingsSlice.reducer;
