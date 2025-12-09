import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Package } from "lucide-react";
import { Product } from "../types/product";
import { ProductService } from "../services/product.service";

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const allProducts = await ProductService.getAllProduct();
            const filtered = allProducts.filter(p =>
                p.title.toLowerCase().includes(keyword.toLowerCase())
            );
            setProducts(filtered);
            setLoading(false);
        };

        fetchProducts();
    }, [keyword]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Quay lại</span>
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Kết quả tìm kiếm
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Tìm thấy <span className="font-semibold text-blue-600">{products.length}</span> sản phẩm cho "{keyword}"
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="text-gray-600 mt-4 font-medium">Đang tìm kiếm...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(item => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/products/${item.id}`)}
                                className="group bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-100"
                            >
                                <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-4 h-48 flex items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        ${item.price}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                        {item.category}
                                    </p>
                                    <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <span className="text-sm font-semibold">{item.rating?.rate || 0}</span>
                                            <span className="text-xs">★</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {item.rating?.count || 0} đánh giá
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Không tìm thấy sản phẩm
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Không có sản phẩm nào phù hợp với từ khóa "{keyword}"
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Quay về trang chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;
