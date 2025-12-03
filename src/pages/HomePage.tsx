import { useEffect, useState } from "react"
import { Product } from "../types/product"
import { ProductService } from "../services/product.service"
import ProductCard from "../components/ProductCard"

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [cates, prods] = await Promise.all([
                    ProductService.getCategories(),
                    ProductService.getAllProduct()
                ])
                console.log("categories:", cates)
                console.log("products:", prods)

                setCategories(cates)
                setProducts(prods)
            } catch (error) {
                console.error('Lỗi tải dữ liệu', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    const handleFilter = async (category: string) => {
        setSelectedCategory(category)
        setLoading(true)
        try {
            if (category === 'all') {
                const data = await ProductService.getAllProduct()
                setProducts(data)
            } else {
                const data = await ProductService.getProductsByCategories(category)
                setProducts(data)
            }
        } catch (error) {
            console.error("Lỗi lọc sản phẩm", error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header & Bộ lọc danh mục */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Sản phẩm nổi bật</h1>

                    {/* Thanh cuộn ngang cho các nút danh mục */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        <button
                            onClick={() => handleFilter('all')}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition shadow-sm ${selectedCategory === 'all'
                                ? 'bg-indigo-600 text-white shadow-indigo-200'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleFilter(cat)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium capitalize transition shadow-sm ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-indigo-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid hiển thị sản phẩm */}
                {loading ? (
                    // Hiệu ứng Loading đơn giản
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.length > 0 ? (
                            products.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                Không tìm thấy sản phẩm nào.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default HomePage