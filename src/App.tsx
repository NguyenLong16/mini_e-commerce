import { Navigate, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useAppSelector } from "./hooks/useRedux";
import PrivateRoute from "./components/PrivateRoute"; // Bảo vệ trang cần login
import AdminRoute from "./components/AdminRoute";     // Bảo vệ trang Admin
import SearchResultPage from "./pages/SearchResultPage";
import { ToastContainer } from "react-toastify";

function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth)

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />

        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Nếu đã login thì không cho vào Login/Register nữa */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
          />

          {/* --- USER PRIVATE ROUTES --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/history" element={<OrderHistoryPage />} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </div>
    </>
  )
}

export default App;