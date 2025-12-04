import { ShoppingCart, Star } from "lucide-react"
import { ProductCardProps } from "../types/product"
import { Link } from "react-router-dom"
import { useCartContext } from "../contexts/CartContext"

const ProductCard = ({ product }: ProductCardProps) => {

    const { addToCart } = useCartContext()

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 
                overflow-hidden hover:shadow-lg transition group flex flex-col h-full"
            >
                <Link
                    to={`/products/${product.id}`}
                    className="relative pt-[100%] overflow-hidden bg-white p-4"
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-300"
                    />
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{product.category}</p>

                    <Link
                        to={`products/${product.id}`}
                        className="font-medium text-gray-800 hover:text-indigo-600 line-clamp-2 mb-2 flex-grow"
                    >
                        {product.title}
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating.rate} ({product.rating.count})</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold text-indigo-600">${product.price}</span>

                        <button
                            className="bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-800 p-2 rounded-full transition"
                            onClick={() => addToCart(product)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard