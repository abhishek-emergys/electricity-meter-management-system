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

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async ({ userId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/api/auth/admin-updateUsers/${userId}`,
                updatedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update user");
        }
    }
);

export const updateUserRole = createAsyncThunk(
    "user/updateUserRole",
    async ({ userId, newRoleId }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/api/auth/superadmin-update-role/${userId}`,
                { new_role_id: newRoleId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update role");
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    "userInfo/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/admin-getAllUsers`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.users;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "userInfo/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/auth/admin-deleteUser/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete user");
        }
    }
);

const userSlice = createSlice({
    name: "userInfo",
    initialState: {
        users: [],
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
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.user_id !== action.payload);
                state.successMessage = "User deleted successfully";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessages } = userSlice.actions;

export default userSlice.reducer;
