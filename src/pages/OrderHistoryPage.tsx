import { useOrder } from '../contexts/OrderContext';
import { useAppSelector } from '../hooks/useRedux'; // 1. Import hook lấy User
import { Package, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
    const { orders } = useOrder();

    // 2. Lấy thông tin User đang đăng nhập từ Redux Store
    const { currentUser } = useAppSelector(state => state.auth);

    // 3. Lọc đơn hàng: Chỉ lấy những đơn có userId trùng với người đang đăng nhập
    // Nếu currentUser null (chưa đăng nhập hoặc lỗi) thì trả về mảng rỗng
    const myOrders = currentUser
        ? orders.filter(order => order.userId === currentUser.id)
        : [];

    if (myOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="bg-indigo-50 p-6 rounded-full mb-4">
                    <Package className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h2>
                <p className="text-gray-500 mb-6">Bạn chưa mua đơn hàng nào trên tài khoản này.</p>
                <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Lịch sử đơn hàng của bạn</h1>
            </div>

            <div className="space-y-6">
                {/* 4. Render danh sách đã lọc (myOrders) thay vì orders gốc */}
                {myOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                        {/* Header của đơn hàng */}
                        <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mã đơn hàng</p>
                                <p className="font-mono text-gray-800 font-medium">#{order.id}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Calendar className="w-4 h-4" />
                                {order.date}
                            </div>
                            <div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {order.status === 'success' ? 'Đã thanh toán' : order.status}
                                </span>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm trong đơn */}
                        <div className="p-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                    <img src={item.image} alt={item.title} className="w-12 h-12 object-contain bg-gray-50 rounded p-1" />
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tổng tiền */}
                        <div className="p-4 bg-indigo-50/30 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Tổng thanh toán</span>
                            <span className="text-xl font-bold text-indigo-700">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryPage;