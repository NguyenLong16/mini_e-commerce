import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../services/auth.service";
import { PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../types/user";

const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (form: any, thunk_API) => {
        try {
            const data = await AuthService.login(form.username, form.password);
            localStorage.setItem('currentUser', JSON.stringify(data))
            return data;
        } catch (error: any) {
            return thunk_API.rejectWithValue(getErrorMessage(error));
        }
    }
)

const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (form: any, thunk_API) => {
        try {
            const data = await AuthService.register(form)
            return data
        } catch (error: any) {
            return thunk_API.rejectWithValue(getErrorMessage(error))
        }
    }
)

interface AuthState {
    currentUser: User | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

const savedUser = localStorage.getItem('currentUser')
const initialState: AuthState = {
    currentUser: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null,
                state.isAuthenticated = false,
                localStorage.removeItem('currentUser')
        },
        clearError: (state) => {
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false
                state.currentUser = action.payload
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }

})

export const { logout, clearError } = authSlice.actions
export { loginUser, registerUser }
export default authSlice.reducer

const getErrorMessage = (error: any) => {
    // Kiểm tra xem có phản hồi từ server không
    if (error.response && error.response.data) {
        const data = error.response.data;

        // Trường hợp 1: Lỗi validation (Ví dụ: Password yếu, thiếu username...)
        // .NET thường trả về dạng: { errors: { Password: ["Mật khẩu phải có số..."] } }
        if (data.errors) {
            const firstErrorKey = Object.keys(data.errors)[0];
            return data.errors[firstErrorKey][0]; // Lấy câu lỗi đầu tiên ra
        }

        // Trường hợp 2: Lỗi string thông thường (Ví dụ: return BadRequest("Sai mật khẩu"))
        if (typeof data === 'string') {
            return data;
        }

        // Trường hợp 3: Lỗi chuẩn ProblemDetails của .NET ({ title: "One or more..." })
        if (data.title) {
            return data.title;
        }
    }

    // Trường hợp 4: Lỗi mạng hoặc không xác định
    return error.message || 'Đã có lỗi xảy ra';
};

