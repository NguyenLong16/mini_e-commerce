import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { clearError, loginUser } from "../redux/slices/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Vui lòng nhập tài khoản"),
    password: Yup.string().required("Vui lòng nhập mật khẩu")
});

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/"); // login thành công → về trang chủ
        }

        dispatch(clearError());
    }, [isAuthenticated]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl w-96 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Đăng nhập
                </h2>

                {error && (
                    <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={(values) => {
                        dispatch(loginUser(values));
                    }}
                >
                    {({ isValid, dirty }) => (
                        <Form className="space-y-4">

                            {/* Username */}
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">
                                    Tài khoản
                                </label>

                                <Field
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">
                                    Mật khẩu
                                </label>

                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !dirty || !isValid}
                                className="w-full bg-indigo-600 text-white py-2 rounded 
                                       hover:bg-indigo-700 transition font-bold 
                                       disabled:bg-indigo-300"
                            >
                                {loading ? "Đang xử lý..." : "Đăng nhập"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;
