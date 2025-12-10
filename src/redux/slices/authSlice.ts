import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../../services/auth.service';
import { User } from '../../types/user';

// Hàm xử lý lỗi để lấy text thông báo
const getErrorMessage = (error: any) => {
    if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.errors) {
            const firstErrorKey = Object.keys(data.errors)[0];
            return data.errors[firstErrorKey][0];
        }
        if (typeof data === 'string') return data;
        if (data.title) return data.title;
    }
    return error.message || 'Đã có lỗi xảy ra';
};

// 1. Login Action
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (form: any, thunkAPI) => {
        try {
            const data = await AuthService.login(form.username, form.password);
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

// 2. Register Action
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (form: any, thunkAPI) => {
        try {
            const data = await AuthService.register(form);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const savedUser = localStorage.getItem('currentUser');
const initialState: AuthState = {
    currentUser: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            localStorage.removeItem('currentUser');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Handlers
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register Handlers
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;