import { useEffect, useState } from "react"
import { Product } from "../types/product"
import { Button, Card, Form, Image, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Tag, Upload } from "antd"
import { ProductService } from "../services/product.service"
import Table, { ColumnsType } from "antd/es/table"
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons"
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import TextArea from "antd/es/input/TextArea"
import { Option } from "antd/es/mentions"
import { set } from "date-fns"

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [form] = Form.useForm()
    const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
    const [searchFilters, setSearchFilters] = useState<{
        title?: string;
        category: string | undefined;
        priceFrom: number | null;
        priceTo: number | null
    }>({
        title: '',
        category: undefined,
        priceFrom: null,
        priceTo: null
    })

    const handleSearch = (key: string, value: any) => {
        setSearchFilters(prev => ({
            ...prev,
            [key]: value ?? undefined
        }))
    }

    const handleResetSearch = () => {
        setSearchFilters({
            title: '',
            category: undefined,
            priceFrom: null,
            priceTo: null
        })
    }

    const filteredProducts = products.filter(product => {
        const matchesTitle = searchFilters.title
            ? product.title.toLowerCase().includes(searchFilters.title.toLowerCase())
            : true

        const matchesCategory = searchFilters.category
            ? product.category === searchFilters.category
            : true

        const matchesPriceFrom = searchFilters.priceFrom !== null
            ? product.price >= searchFilters.priceFrom
            : true

        const matchesPriceTo = searchFilters.priceTo !== null
            ? product.price <= searchFilters.priceTo
            : true

        return matchesTitle && matchesCategory && matchesPriceFrom && matchesPriceTo
    })


    const fetchProducts = async () => {
        try {
            setLoading(true)
            const data = await ProductService.getAllProduct()
            setProducts(data)
            setLoading(false)
        } catch (error) {
            message.error("Lỗi không tải được danh sách sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const columns: ColumnsType<Product> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            render: (text: string) => <span className="font-mono text-gray-500">#{text}</span>
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (src: any) => (
                <Image
                    src={src || "https://placed.co/100"}
                    width={60}
                    height={60}
                    className="object-contain rounded-md border border-gray-200"
                />
            )
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-medium text-gray-800 line-clamp-1">{text}</span>
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (tag: string) => (
                <Tag color="geekblue" className="uppercase text-[10px] font-bold">
                    {tag}
                </Tag>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <span className="font-bold text-indigo-600">${price}</span>,
            sorter: (a: Product, b: Product) => a.price - b.price,
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 150,
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button
                        type="primary" ghost
                        onClick={() => handleOpenModal(record)}
                        icon={<EditOutlined />}
                    />
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa sản phâm này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            // Đổ dữ liệu vào form
            form.setFieldsValue({
                title: product.title,
                price: product.price,
                category: product.category,
                description: product.description
            });
            // Hiển thị ảnh cũ trong upload list
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: product.image,
            }]);
        } else {
            setEditingProduct(null);
            form.resetFields();
            setFileList([]);
        }
        setIsModalOpen(true);
    };

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file: File) => {
        return false;
    };

    // 5. Xử lý Submit Form (Thêm/Sửa)
    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("Title", values.title);
        formData.append("Price", values.price);
        formData.append("Category", values.category);
        formData.append("Description", values.description);

        // Kiểm tra xem có file ảnh mới không
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append("ImageFile", fileList[0].originFileObj as File);
        }

        try {
            if (editingProduct) {
                await ProductService.updateProduct(editingProduct.id, formData);
                message.success("Cập nhật sản phẩm thành công!");
            } else {
                await ProductService.createProduct(formData);
                message.success("Thêm sản phẩm mới thành công!");
            }
            setIsModalOpen(false);
            fetchProducts(); // Tải lại bảng
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await ProductService.deleteProduct(id);
            message.success("Đã xóa sản phẩm");
            // Cập nhật lại state local để đỡ phải gọi API lại (hoặc gọi fetchProducts cũng được)
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            message.error("Không thể xóa sản phẩm này");
        }
    };
    return (
        <>
            <div className="p-6 min-h-screen bg-slate-50">
                {/* Header sử dụng Tailwind cho layout linh hoạt */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Quản lý Sản phẩm</h1>
                        <p className="text-slate-500 text-sm">Danh sách các mặt hàng đang kinh doanh</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        className="bg-indigo-600 hover:bg-indigo-500 shadow-md"
                        onClick={() => handleOpenModal()}
                    >
                        Thêm sản phẩm
                    </Button>
                </div>

                {/* BẢNG DỮ LIỆU ANTD */}
                <Card bordered={false} className="shadow-sm rounded-xl overflow-hidden">
                    {/* SEARCH & FILTER */}
                    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                            {/* Search title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Tên sản phẩm
                                </label>
                                <Input
                                    placeholder="Nhập tên sản phẩm..."
                                    prefix={<SearchOutlined />}
                                    value={searchFilters.title}
                                    onChange={(e) => handleSearch('title', e.target.value)}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Danh mục
                                </label>
                                <Select
                                    placeholder="Chọn danh mục"
                                    allowClear
                                    className="w-full"
                                    value={searchFilters.category}
                                    onChange={(value) => handleSearch('category', value)}
                                >
                                    {categories.map(c => (
                                        <Select.Option key={c} value={c}>
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Price from */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Giá từ
                                </label>
                                <InputNumber
                                    className="w-full"
                                    min={0}
                                    placeholder="$"
                                    value={searchFilters.priceFrom ?? undefined}
                                    onChange={(value) => handleSearch('priceFrom', value)}
                                />
                            </div>

                            {/* Price to */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Giá đến
                                </label>
                                <InputNumber
                                    className="w-full"
                                    min={0}
                                    placeholder="$"
                                    value={searchFilters.priceTo ?? undefined}
                                    onChange={(value) => handleSearch('priceTo', value)}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        {(searchFilters.title ||
                            searchFilters.category ||
                            searchFilters.priceFrom !== null ||
                            searchFilters.priceTo !== null) && (
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleResetSearch}>
                                        Xóa bộ lọc
                                    </Button>
                                </div>
                            )}
                    </div>


                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 600 }}
                    />
                </Card>

                {/* MODAL FORM ANTD */}
                <Modal
                    title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null} // Tắt footer mặc định để dùng nút submit của Form
                    centered
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="mt-4"
                    >
                        {/* Ảnh sản phẩm */}
                        <Form.Item label="Hình ảnh sản phẩm">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                accept="image/*"
                            >
                                {fileList.length < 1 && (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        {/* Tên sản phẩm */}
                        <Form.Item
                            label="Tên sản phẩm"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                        >
                            <Input placeholder="Nhập tên sản phẩm..." />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Giá */}
                            <Form.Item
                                label="Giá ($)"
                                name="price"
                                rules={[{ required: true, message: 'Nhập giá!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `$ ${value}`}
                                />
                            </Form.Item>

                            {/* Danh mục */}
                            <Form.Item
                                label="Danh mục"
                                name="category"
                                rules={[{ required: true, message: 'Chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Mô tả */}
                        <Form.Item
                            label="Mô tả chi tiết"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <TextArea rows={4} placeholder="Thông tin chi tiết về sản phẩm..." />
                        </Form.Item>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                            <Button type="primary" htmlType="submit" className="bg-indigo-600">
                                {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

export default ProductManagement