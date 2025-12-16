import { useState } from "react";
import {
    Avatar,
    Button,
    Dropdown,
    Layout,
    Menu,
    theme,
} from "antd";
import {
    DashboardOutlined,
    HomeFilled,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    ShoppingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom"; // Quan trọng: Outlet
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { logout } from "../redux/slices/authSlice";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === "logout") {
            dispatch(logout());
            navigate("/");
        } else if (key === "home") {
            navigate("/");
        } else {
            navigate(`/admin${key === "dashboard" ? "" : key}`);
        }
    };

    const dropdownItems = [
        { key: "home", label: "Trang chủ", icon: <DashboardOutlined /> },
        { key: "dashboard", label: "Dashboard" },
        { key: "/users", label: "Quản lý người dùng" },
        { type: "divider" as const },
        { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true },
    ];

    return (
        <Layout className="min-h-screen">
            {/* Sidebar - giữ nguyên cho mọi trang admin */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={250}
                className="fixed left-0 top-0 bottom-0 z-20 overflow-y-auto"
            >
                <div className="flex items-center justify-center h-16 m-4 rounded-lg bg-white/10">
                    {collapsed ? (
                        <span className="text-white font-bold text-xl">MS</span>
                    ) : (
                        <span className="text-white font-bold text-xl tracking-wider">
                            MINISTORE
                        </span>
                    )}
                </div>

                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-lg text-white w-16 h-16 ml-6"
                />

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[""]}
                    selectedKeys={[location.pathname.replace("/admin", "") || "dashboard"]}
                    onClick={handleMenuClick}
                    items={[
                        { key: "dashboard", icon: <DashboardOutlined />, label: "Tổng quan" },
                        { key: "/users", icon: <UserOutlined />, label: "Quản lý Người dùng" },
                        { key: "/products", icon: <ShoppingOutlined />, label: "Quản lý Sản phẩm" },
                        { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt hệ thống" },
                        { key: "home", icon: <HomeFilled />, label: "Về trang chủ" },
                        { type: "divider" as const },
                        { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
                    ]}
                />
            </Sider>

            <Layout className={collapsed ? "ml-20" : "ml-64"} transition-all duration-300>
                {/* Header - cũng giữ nguyên */}


                {/* Nội dung thay đổi theo route */}
                <Content
                    className="m-6 p-8 rounded-2xl overflow-y-auto"
                    style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
                >
                    <Outlet /> {/* Đây là chỗ render các trang con như Dashboard, UserManagement */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;