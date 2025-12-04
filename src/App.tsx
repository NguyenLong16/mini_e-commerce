import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* 1. Navbar nằm NGOÀI Routes để luôn hiển thị ở mọi trang */}
        <Navbar />

        {/* 2. Routes chỉ chứa các TRANG LỚN (Pages) */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="history" element={<OrderHistoryPage />} />

        </Routes>
      </div>
    </>
  )
}

export default App;
