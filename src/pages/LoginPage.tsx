import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useNavigate, Link } from "react-router-dom";
import { clearError, loginUser } from "../redux/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Vui lòng nhập tài khoản"),
    password: Yup.string().required("Vui lòng nhập mật khẩu")
});

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, currentUser } = useAppSelector(state => state.auth);

    // 1. Kiểm tra nếu đã đăng nhập thì tự chuyển trang
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            // Chuyển role về chữ thường để so sánh an toàn (tránh lỗi Admin vs admin)
            const role = currentUser.role?.toLowerCase();
            if (role === 'admin') {
                navigate('/admin');
            } else {
                console.log('role', role)
                navigate('/');
            }
        }
        return () => { dispatch(clearError()) };
    }, [isAuthenticated, currentUser, navigate, dispatch]);

    const formik = useFormik({
        initialValues: { username: "", password: "" },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                // 2. Gọi API Login
                const result = await dispatch(loginUser(values)).unwrap();

                console.log("=== KẾT QUẢ ĐĂNG NHẬP ===");
                console.log("Toàn bộ object result:", result);
                console.log("Role nhận được:", result.role); // Kiểm tra xem nó là 'Admin', 'admin', hay undefined?
                console.log("Role sau khi toLowerCase:", result.role?.toLowerCase());
                // 3. Điều hướng ngay sau khi login thành công
                const role = result.role?.toLowerCase();
                if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } catch (err) {
                console.error("Login failed:", err);
            }
        }
    });

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl w-96 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập</h2>

                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 mb-1 font-medium">Tài khoản</label>
                        <input
                            type="text"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {formik.errors.username && formik.touched.username && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1 font-medium">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {formik.errors.password && formik.touched.password && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-2 rounded transition font-bold 
                            ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Chưa có tài khoản?
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline ml-1">
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;