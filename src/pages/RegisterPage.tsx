import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            username: "",
            fullname: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, "Tên đăng nhập phải ít nhất 3 ký tự")
                .required("Vui lòng nhập tên đăng nhập"),
            fullname: Yup.string().required("Vui lòng nhập họ tên"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Vui lòng nhập email"),
            password: Yup.string()
                .min(6, "Mật khẩu phải ít nhất 6 ký tự")
                .required("Vui lòng nhập mật khẩu"),
        }),
        onSubmit: async (values) => {
            dispatch(registerUser(values))
                .unwrap()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => { })
        },
    });

    return (
        <div className="w-full max-w-md mx-auto mt-16 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">

                {/* USERNAME */}
                <div>
                    <label className="block mb-1">Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        className="w-full p-2 border rounded"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-sm">{formik.errors.username}</p>
                    )}
                </div>

                {/* FULLNAME */}
                <div>
                    <label className="block mb-1">Họ tên</label>
                    <input
                        type="text"
                        name="fullname"
                        className="w-full p-2 border rounded"
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullname && formik.errors.fullname && (
                        <p className="text-red-500 text-sm">{formik.errors.fullname}</p>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>

                {/* ERROR FROM SERVER */}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
