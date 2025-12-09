import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Order, OrderContextType } from "../types/order";
import { CartItem } from "../types/product";

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const OrderContextProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        //load lịch sử localStorage khi vào web
        const savedOrders = localStorage.getItem('order_history')
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders))
        }
    }, [])

    //Hàm tạo đơn đặt hàng
    const addOrder = (items: CartItem[], total: number, userId: number) => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            userId: userId,
            date: new Date().toLocaleString('vi-VN'),
            total: total,
            items: items,
            status: 'success'
        }

        const updateOrder = [newOrder, ...orders]
        setOrders(updateOrder)
        //lưu vào localStorage
        localStorage.setItem('order_history', JSON.stringify(updateOrder))
    }

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => {
    const context = useContext(OrderContext)
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider')
    }

    return context
}

export default OrderContextProvider