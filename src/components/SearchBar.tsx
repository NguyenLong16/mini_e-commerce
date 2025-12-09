import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Product } from "../types/product";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { searchProducts } from "../redux/slices/paginationSlice";

const SearchBar = () => {
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // 1. Thay inputRef bằng wrapperRef để bao quát cả cụm
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const debounced = useDebounce(keyword, 300);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.products.products)

    useEffect(() => {
        if (!debounced) {
            setSuggestions([]);
            return;
        }
        const filtered = products.filter(item =>
            item.title.toLowerCase().includes(debounced.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
    }, [debounced, products]);

    // 2. Sửa logic Click Outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Kiểm tra xem click có nằm trong wrapperRef không
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && keyword.trim() !== "") {
            dispatch(searchProducts(keyword))
            navigate(`/search?keyword=${keyword}`);
            setIsFocused(false);
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    const handleClear = () => {
        setKeyword("");
        setSuggestions([]);
        setIsFocused(true)
        setShowDropdown(false); // Clear thì ẩn dropdown luôn
    };

    const handleSuggestionClick = (id: number) => {
        console.log("Click ID:", id);
        navigate(`/products/${id}`); // Chú ý đường dẫn /product/:id
        setSuggestions([]);
        setKeyword("");
        setIsFocused(false);
        setShowDropdown(false);
    };

    return (
        // 3. Gắn wrapperRef vào thẻ cha ngoài cùng
        <div className="relative w-full" ref={wrapperRef}>
            <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>

                <input
                    value={keyword}
                    onKeyDown={handleEnter}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                        setShowDropdown(true)
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-200
                        ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-gray-300'}
                        focus:outline-none bg-white`}
                />

                {keyword && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showDropdown && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                        {suggestions.map((item, index) => (
                            <li
                                key={item.id}
                                className={`p-4 cursor-pointer hover:bg-blue-50 transition-all duration-150 flex items-center gap-3
                                    ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                                onClick={() => handleSuggestionClick(item.id)}
                            >
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                        {item.category}
                                    </p>
                                </div>
                                <div className="text-sm font-semibold text-blue-600">
                                    ${item.price}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;