import { useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../hooks/useRedux"
import { fetchProducts, setCategories, setPage, fetchCategories } from "../redux/slices/paginationSlice"

const HomePage = () => {
    const dispatch = useAppDispatch()

    const {
        filteredProducts,
        categories,
        loading,
        currentPage,
        itemsPerPage,
        selectedCategory
    } = useAppSelector((state: any) => state.products)

    // Load categories + all products khi vào trang
    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchProducts())
    }, [dispatch])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentPage])

    // Xử lý chọn category
    const handleFilter = (category: string) => {
        dispatch(setCategories(category))
    }

    // Tính toán phân trang dựa trên filteredProducts
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
    const totalPage = Math.ceil(filteredProducts.length / itemsPerPage)

    // Nút chuyển trang
    const paginate = (page: number) => dispatch(setPage(page))

    // Logic hiển thị phân trang với "...”
    const renderPagination = () => {
        const pageItems: (string | number)[] = []

        pageItems.push(1)

        if (currentPage > 3) pageItems.push("...")

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPage - 1, currentPage + 1)

        for (let i = start; i <= end; i++) pageItems.push(i)

        if (currentPage < totalPage - 2) pageItems.push("...")

        if (totalPage > 1) pageItems.push(totalPage)

        return pageItems.map((p, idx) => (
            <button
                key={idx}
                disabled={p === "..."}
                onClick={() => typeof p === "number" && paginate(p)}
                className={`w-10 h-10 rounded-lg font-medium transition ${p === currentPage
                    ? "bg-indigo-600 text-white shadow"
                    : p === "..."
                        ? "cursor-default text-gray-500"
                        : "text-gray-600 hover:bg-gray-100 border"
                    }`}
            >
                {p}
            </button>
        ))
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header & Filter */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Sản phẩm nổi bật
                    </h1>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
                        <button
                            onClick={() => handleFilter("all")}
                            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${selectedCategory === "all"
                                ? "bg-indigo-600 text-white shadow-indigo-200"
                                : "bg-white text-gray-600 hover:bg-gray-100 border"
                                }`}
                        >
                            Tất cả
                        </button>

                        {categories.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => handleFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize shadow-sm ${selectedCategory === cat
                                    ? "bg-indigo-600 text-white shadow-indigo-200"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                Không tìm thấy sản phẩm nào.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="flex justify-center items-center gap-2 pb-10">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border hover:bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {renderPagination()}

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPage}
                        className="p-2 rounded-lg border hover:bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </>
    )
}

export default HomePage
