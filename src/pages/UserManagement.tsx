import { useEffect, useRef, useState } from "react";
import { User } from "../types/user";
import { UserService } from "../services/user.service";
import { Edit, Plus, Trash, Upload, X, Shield, User as UserIcon } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const UserManagement = () => {
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        role: "User",
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await UserService.getAllUsers();
            setUser(data);
        } catch (error) {
            console.error("Lỗi tải users", error);
            showToast("Không thể tải danh sách người dùng", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (u?: User) => {
        if (u) {
            setEditingUser(u);
            setFormData({
                username: u.username,
                fullname: u.fullname,
                email: u.email,
                password: "",
                role: u.role,
            });
            setPreviewImage(u.image || null);
        } else {
            setEditingUser(null);
            setFormData({
                username: "",
                fullname: "",
                email: "",
                password: "",
                role: "User",
            });
            setPreviewImage(null);
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("Username", formData.username);
        if (formData.password) {
            data.append("Password", formData.password);
        }
        data.append("Fullname", formData.fullname);
        data.append("Email", formData.email);
        data.append("Role", formData.role);

        if (selectedFile) {
            data.append("ImageFile", selectedFile);
        }

        try {
            if (editingUser) {
                await UserService.updateUser(data, editingUser.id);
                showToast("Cập nhật người dùng thành công", "success");
            } else {
                await UserService.createUser(data);
                showToast("Thêm người dùng mới thành công", "success");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi lưu user:", error);
            showToast("Có lỗi xảy ra khi lưu người dùng", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
            try {
                await UserService.deleteUser(id);
                setUser(user.filter((u) => u.id !== id));
                showToast("Xóa người dùng thành công", "success");
            } catch (error) {
                console.error("Lỗi không thể xóa", error);
                showToast("Không thể xóa người dùng", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Quản lý người dùng</h1>
                        <p className="text-slate-600">Quản lý thông tin và quyền hạn người dùng</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl
                        flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                    >
                        <Plus size={20} />
                        Thêm người dùng
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Avatar
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Họ và tên
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Tên đăng nhập
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : user.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-500">
                                            Chưa có người dùng nào
                                        </td>
                                    </tr>
                                ) : (
                                    user.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <span className="font-mono text-sm text-slate-500">#{u.id}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                                                    <img
                                                        src={u.image || "/default-avatar.png"}
                                                        alt={u.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-semibold text-slate-800">{u.fullname}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-slate-700">{u.username}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-slate-600">{u.email}</span>
                                            </td>
                                            <td className="p-4">
                                                {u.role === "Admin" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 border border-rose-200">
                                                        <Shield size={14} />
                                                        Quản trị viên
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                                                        <UserIcon size={14} />
                                                        Khách hàng
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(u)}
                                                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white scrollbar-hide rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto animate-scale-in">
                        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {!editingUser ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="flex flex-col items-center gap-4 mb-2">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg">
                                        <img
                                            src={previewImage || "/default-avatar.png"}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div
                                        onClick={() => inputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Upload size={28} className="text-white" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={inputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                                >
                                    Chọn ảnh đại diện
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Tên đăng nhập
                                    </label>
                                    <input
                                        required
                                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                                        disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        disabled={!!editingUser}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vai trò</label>
                                    <select
                                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="User">Khách hàng</option>
                                        <option value="Admin">Quản trị viên</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                <input
                                    required
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {editingUser ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu"}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl
                                font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mt-6"
                            >
                                {editingUser ? "Lưu thay đổi" : "Tạo người dùng"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
