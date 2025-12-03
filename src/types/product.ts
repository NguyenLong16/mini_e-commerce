export interface Product {
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: {
        rate: number,
        count: number,
    }
}

export interface ProductCardProps {
    product: Product
}

//interface giỏ hàng
export interface CartItem extends Product {
    quantity: number
}