import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAppSelector } from "./hooks/useRedux";

function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth)
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
          <Route
            path="login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
          />

        </Routes>
      </div>
    </>
  )
}

export default App;
