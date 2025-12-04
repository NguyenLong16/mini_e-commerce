import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/product.service';
import { Product } from '../types/product';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const { addToCart } = useCartContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu chi tiết sản phẩm
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await ProductService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy sản phẩm!</h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-indigo-600 hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition font-medium"
            >
                <ArrowLeft className="w-5 h-5" /> Quay lại
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-center h-fit">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full max-h-[500px] object-contain hover:scale-105 transition duration-500"
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mb-2">
                        {product.category}
                    </span>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-gray-800">{product.rating.rate}</span>
                        </div>
                        <span className="text-gray-500 text-sm">({product.rating.count} đánh giá)</span>
                    </div>

                    <div className="text-4xl font-bold text-indigo-600 mb-6">
                        ${product.price}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Truck className="w-5 h-5 text-indigo-500" />
                            <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>Bảo hành 2 năm</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;