// ... các import khác
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/AdminLayout";     // Thêm dòng này
import AdminDashboard from "./pages/AdminDashboard";   // Trang dashboard chính
import UserManagement from "./pages/UserManagement";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchResultPage from "./pages/SearchResultPage";
import PrivateRoute from "./components/PrivateRoute";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminRoute from "./components/AdminRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductManagement from "./pages/ProductManagement";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          {/* ... login/register như cũ */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* USER PRIVATE ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/history" element={<OrderHistoryPage />} />
          </Route>

          {/* ADMIN ROUTES - Dùng chung layout */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />        {/* Trang tổng quan */}
              <Route path="/admin/users" element={<UserManagement />} />  {/* Quản lý user */}
              <Route path="/admin/products" element={<ProductManagement />} />  {/* Quản lý sản phẩm */}
              {/* Thêm các route admin khác ở đây sau này */}
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;