import { ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useCartContext } from "../contexts/CartContext"

const Navbar = () => {
    const { cartCount } = useCartContext()
    return (
        <>
            <nav className="bg-white sticky z-50 top-0 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to={`/`}
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        MiniStore
                    </Link>

                    <Link to='/cart' className="relative cursor-pointer">
                        <ShoppingBag className="w-7 h-7 text-gray-700 hover:text-indigo-600 transition" />
                        {cartCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                            font-bold w-5 h-5 rounded-full flex items-center justify-center"
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar