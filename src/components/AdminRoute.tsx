import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

const AdminRoute = () => {
    const { isAuthenticated, currentUser } = useAppSelector(state => state.auth);

    // Chưa đăng nhập -> Về Login
    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Đã đăng nhập nhưng không phải Admin -> Về Home
    if (currentUser.role?.toLowerCase() !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Là Admin -> Cho qua
    return <Outlet />;
};

export default AdminRoute;