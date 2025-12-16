// App.tsx
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo import CSS toast

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
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
  // Áp dụng theme từ localStorage khi app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // sẽ tự theo dark/light nếu có class dark
      />

      {/* Wrapper chính - áp dụng bg và text mặc định cho toàn app */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar /> {/* Navbar sẽ có nút toggle */}

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* USER PRIVATE ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/history" element={<OrderHistoryPage />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/products" element={<ProductManagement />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;