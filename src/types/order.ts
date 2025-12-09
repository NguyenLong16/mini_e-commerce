import { CartItem } from "./product";

export interface Order {
    id: string;
    userId: number;
    date: string;
    total: number;
    items: CartItem[] //Danh sách sản phẩm đã mua
    status: 'success' | 'pending'
}

export interface OrderContextType {
    orders: Order[]
    addOrder: (items: CartItem[], total: number, userId: number) => void
}