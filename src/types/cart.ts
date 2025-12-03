import { CartItem, Product } from "./product";

export interface CartContextType {
    cartItem: CartItem[],
    addToCart: (product: Product) => void,
    removeFromCart: (id: number) => void,
    updateQuantity: (id: number, quantity: number) => void,
    clearCart: () => void,
    cartTotal: number,
    cartCount: number
}