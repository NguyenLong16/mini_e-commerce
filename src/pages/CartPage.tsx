import { Minus, Plus, Trash } from "lucide-react"
import { useCartContext } from "../contexts/CartContext"
import { Link } from "react-router-dom"

const CartPage = () => {

    const { cartItem, removeFromCart, updateQuantity, clearCart, cartTotal } = useCartContext()

    if (cartItem.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Trash className="text-gray-400 w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Giỏ hàng trống
                </h2>
                <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <Link
                    to='/'
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg
                    hover:bg-indigo-700 transition font-medium"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-4">
                        {cartItem.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 line-camp-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                    <p className="font-bold text-indigo-600">{item.price}</p>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-red-500 text-sm hover:underline mt-4"
                        >
                            Xóa tất cả sản phẩm
                        </button>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Tổng đơn hàng
                            </h3>

                            <div className="spance-y-3 mb-6 border-b pb-6 border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                                <span className="text-2xl font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
                            </div>

                            <button
                                className="w-full py-4 bg-indigo-600 text-white rounde-xl font bold
                                hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                            >
                                Thanh toán ngay
                            </button>

                            <Link
                                to='/'
                                className="block text-center mt-4 text-gray-500 hover:text-indigo-600 text-sm
                                flex items-center justify-center gap-1"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage