import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { CartContextType } from "../types/cart"
import { CartItem, Product } from "../types/product"

const CartContext = createContext<CartContextType | undefined>(undefined)

const CartContextProvider = ({ children }: { children: ReactNode }) => {
    const [cartItem, setCartItem] = useState<CartItem[]>([])

    useEffect(() => {
        const savedCart = localStorage.getItem('cart_item')
        if (savedCart) {
            setCartItem(JSON.parse(savedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart_item', JSON.stringify(cartItem))
    }, [cartItem])

    const addToCart = (product: Product) => {
        setCartItem(prev => {
            const existingItem = (prev.find(item => item.id === product.id))
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? ({ ...item, quantity: item.quantity + 1 })
                        : (item)
                )
            }
            //Nếu chưa có thì thêm mới 
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCartItem(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 0) {
            removeFromCart(id)
            return
        }
        setCartItem(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        setCartItem([])
        localStorage.removeItem('cart_item')
    }

    const cartTotal = cartItem.reduce((total, item) => total + (item.price * item.quantity), 0)

    const cartCount = cartItem.reduce((count, item) => count + item.quantity, 0)

    return (
        <>
            <CartContext.Provider value={{ cartItem, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
                {children}
            </CartContext.Provider>
        </>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("UseCart must be use within a CartProvider")
    return context
}


export default CartContextProvider