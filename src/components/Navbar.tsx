import { History, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useCartContext } from "../contexts/CartContext"
import { useAppDispatch, useAppSelector } from "../hooks/useRedux"
import { logout } from "../redux/slices/authSlice"

const Navbar = () => {
    const { cartCount } = useCartContext()
    const { isAuthenticated, currentUser } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }
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

                    <div>
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white 
                                    hover:bg-indigo-600 transition shadow font-medium mr-2"
                                >
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white 
                                    hover:bg-indigo-600 transition shadow font-medium"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <>

                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 
                                hover:bg-red-500 hover:text-white transition shadow font-medium"
                                >
                                    Đăng xuất
                                </button>
                                <div className="flex items-center gap-3">
                                    {isAuthenticated && (
                                        <span className="text-gray-700 font-medium">
                                            Xin chào, <span className="text-indigo-600 font-semibold">
                                                {currentUser?.fullname}
                                            </span>
                                        </span>
                                    )}
                                    {/* Giỏ hàng */}
                                    <Link
                                        to="/cart"
                                        className="relative cursor-pointer"
                                    >
                                        <ShoppingBag className="w-7 h-7 text-gray-700 hover:text-indigo-600 transition" />

                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold
                                        w-5 h-5 rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Lịch sử đơn hàng */}
                                    <Link to="/history" className="cursor-pointer">
                                        <History className="w-7 h-7 text-gray-700 hover:text-indigo-600 transition" />
                                    </Link>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar