import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ProductService } from '../../services/product.service'
import { Product } from '../../types/product'

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, thunkAPI) => {
        try {
            return await ProductService.getAllProduct()
        } catch {
            return thunkAPI.rejectWithValue("Lỗi hiển thị sản phẩm")
        }
    }
)

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, thunkAPI) => {
        try {
            return await ProductService.getCategories()
        } catch {
            return thunkAPI.rejectWithValue("Lỗi hiển thị danh mục")
        }
    }
)

interface ProductState {
    products: Product[];
    filteredProducts: Product[];
    categories: string[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    itemsPerPage: number;
    selectedCategory: string;
}

const initialState: ProductState = {
    products: [],
    filteredProducts: [],
    categories: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 4,
    selectedCategory: 'all',
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload
        },

        setCategories(state, action) {
            state.selectedCategory = action.payload
            state.currentPage = 1

            if (action.payload === "all") {
                state.filteredProducts = state.products
            } else {
                state.filteredProducts = state.products.filter(
                    p => p.category === action.payload
                )
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload
                state.filteredProducts = action.payload
                state.loading = false
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload
                state.loading = false
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { setPage, setCategories } = productSlice.actions
export default productSlice.reducer
