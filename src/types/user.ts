export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    password: string;
    image?: string;
    role: string;
}

export interface LoginResponse {
    user: User
}