export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User
}