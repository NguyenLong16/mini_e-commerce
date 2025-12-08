import axios from "axios"

const API_URL = 'https://localhost:7187/api/Auth'

const AuthService = {
    login: async (username: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`, { username, password })
        return response.data
    },

    register: async (form: any) => {
        const response = await axios.post(`${API_URL}/register`, form)
        return response.data
    }
}

export default AuthService