import axios from "axios"
import { User } from "../types/user"

const API_URL = "https://localhost:7187/api/Users"

export const UserService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await axios.get(API_URL)
        return response.data
    },

    createUser: async (formData: FormData): Promise<User> => {
        const response = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    updateUser: async (formData: FormData, id: number): Promise<User> => {
        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`)
    }
}