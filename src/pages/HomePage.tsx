import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchProducts, setCategories, setPage, fetchCategories } from "../redux/slices/paginationSlice";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
    const dispatch = useAppDispatch();

    const {
        filteredProducts,
        categories,
        loading,
        currentPage,
        itemsPerPage,
        selectedCategory,
    } = useAppSelector((state: any) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handleFilter = (category: string) => {
        dispatch(setCategories(category));
        dispatch(setPage(1));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (page: number) => dispatch(setPage(page));

    const renderPagination = () => {
        const pageItems: (string | number)[] = [];

        pageItems.push(1);

        if (currentPage > 3) pageItems.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPage - 1, currentPage + 1);

        for (let i = start; i <= end; i++) pageItems.push(i);

        if (currentPage < totalPage - 2) pageItems.push("...");

        if (totalPage > 1) pageItems.push(totalPage);

        return pageItems.map((p, idx) => (
            <button
                key={idx}
                disabled={p === "..."}
                onClick={() => typeof p === "number" && paginate(p)}
                className={`w-10 h-10 rounded-lg font-medium transition ${p === currentPage
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : p === "..."
                        ? "cursor-default text-gray-500"
                        : "text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300"
                    }`}
            >
                {p}
            </button>
        ));
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Sản phẩm nổi bật
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Khám phá bộ sưu tập sản phẩm chất lượng cao
                        </p>
                    </div>

                    <div className="w-full lg:w-80">
                        <SearchBar />
                    </div>
                </div>

                <div className="flex gap-2 pb-3 w-full no-scrollbar overflow-x-auto lg:overflow-visible">
                    <button
                        onClick={() => handleFilter("all")}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${selectedCategory === "all"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                            }`}
                    >
                        Tất cả
                    </button>

                    {categories.map((cat: any) => (
                        <button
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all shadow-sm ${selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="text-gray-600 mt-4 font-medium">Đang tải sản phẩm...</p>
                    </div>
                ) : (
                    <div className="mt-10">
                        {currentProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {currentProducts.map((p: any) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl">
                                <p className="text-gray-600 text-lg font-medium">
                                    Không tìm thấy sản phẩm nào
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {totalPage > 1 && (
                <div className="flex justify-center items-center gap-2 pb-12 mt-12">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    {renderPagination()}

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPage}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            )}
        </>
    );
};

export default HomePage;
