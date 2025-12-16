import { Product } from "../types/product"
import axios from 'axios'

const API_URL = 'https://localhost:7187/api/Product'

export const ProductService = {
    getAllProduct: async (): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}`)
        return response.data
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    },

    //lấy danh sách mục
    getCategories: async (): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/categories`)
        return response.data
    },

    //lấy sản phẩm theo mục 
    getProductsByCategories: async (category: string): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}/category/${category}`)
        return response.data
    },

    createProduct: async (formData: FormData): Promise<Product> => {
        const response = await axios.post(`${API_URL}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    updateProduct: async (id: number, formData: FormData): Promise<Product> => {
        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    deleteProduct: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`)
    },
}