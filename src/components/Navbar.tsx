import { History, ShoppingBag, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { logout } from "../redux/slices/authSlice";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { cartCount } = useCartContext();
    const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="mx-auto max-w-screen-xl px-6">
                <div className="flex h-18 items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            MiniStore
                        </Link>

                        <ThemeToggle />
                    </div>

                    {/* CENTER - Greeting */}
                    {isAuthenticated && (
                        <div className="hidden md:block text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Xin chào
                            </p>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                                {currentUser?.fullname}
                            </p>
                        </div>
                    )}

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">

                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                                >
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Cart */}
                                <Link to="/cart" className="relative group">
                                    <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* History */}
                                <Link to="/history" className="group">
                                    <History className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition" />
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Đăng xuất</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
