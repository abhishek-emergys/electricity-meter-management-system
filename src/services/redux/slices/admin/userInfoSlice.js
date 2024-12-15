import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("userToken");

export const addUser = createAsyncThunk(
    "user/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/create-user`, userData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add user");
        }
    }
);

const userSlice = createSlice({
    name: "userInfo",
    initialState: {
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessages } = userSlice.actions;

export default userSlice.reducer;
