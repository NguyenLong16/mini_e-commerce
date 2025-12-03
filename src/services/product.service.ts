import { Product } from "../types/product"
import axios from 'axios'

const API_URL = 'https://fakestoreapi.com'

export const ProductService = {
    getAllProduct: async (): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}/products`)
        return response.data
    },

    getProductById: async (id: string): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}/products/${id}`)
        return response.data
    },

    //lấy danh sách mục
    getCategories: async (): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/products/categories`)
        return response.data
    },

    //lấy sản phẩm theo mục 
    getProductsByCategories: async (category: string): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}/products/category/${category}`)
        return response.data
    }
}