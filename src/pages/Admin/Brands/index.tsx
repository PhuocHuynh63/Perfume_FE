import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Search, Plus, Edit, Trash2, X, RefreshCw } from "lucide-react"
import brandService from "@services/brand"
import { toast } from "react-toastify"
import { ROUTES } from "@constants/route"
import { Link } from "react-router-dom"

// Define interfaces
interface Brand {
    _id: string
    brandName: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface BrandFormData {
    brandName: string
}

const AdminBrandPage = () => {
    // State for brands list
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    // State for search
    const [search, setSearch] = useState("")

    // State for form management
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BrandFormData>()

    // Fetch brands
    const fetchBrands = async () => {
        try {
            setLoading(true)
            const response = await brandService.findAllBrand()
            setBrands(response.data.data.data || [])
        } catch (error) {
            console.error("Error fetching brands:", error)
            toast.error("Không thể tải dữ liệu thương hiệu")
        } finally {
            setLoading(false)
        }
    }

    // Initial data load
    useEffect(() => {
        fetchBrands()
    }, [])

    // Refetch when search changes
    // useEffect(() => {
    //     fetchBrands('')
    // }, [search])

    // Handle form submission for new brand
    const onSubmitNewBrand = async (data: BrandFormData) => {
        try {
            await brandService.createBrand(data)
            toast.success("Thêm thương hiệu mới thành công")
            setIsAddingNew(false)
            reset()
            fetchBrands()
        } catch (error) {
            console.error("Error creating brand:", error)
            toast.error("Không thể thêm thương hiệu mới")
        }
    }

    // Handle form submission for editing brand
    const onSubmitEditBrand = async (data: BrandFormData) => {
        if (!editingId) return

        try {
            await brandService.updateBrand(editingId, data)
            toast.success("Cập nhật thương hiệu thành công")
            setEditingId(null)
            fetchBrands()
        } catch (error) {
            console.error("Error updating brand:", error)
            toast.error("Không thể cập nhật thương hiệu")
        }
    }

    // Handle delete brand
    const handleDeleteBrand = async (id: string) => {
        if (
            !window.confirm(
                "Bạn có chắc chắn muốn xóa thương hiệu này? Lưu ý: Việc xóa thương hiệu có thể ảnh hưởng đến các sản phẩm liên quan.",
            )
        )
            return
        try {
            await brandService.deleteBrand(id)
            toast.success("Xóa thương hiệu thành công")
            fetchBrands()
        } catch (error) {
            console.error("Error deleting brand:", error)
            toast.error(error.response?.data?.message || "Không thể xóa thương hiệu")
        }
    }

    // Start editing a brand
    const handleStartEdit = (brand: Brand) => {
        setEditingId(brand._id)
        setValue("brandName", brand.brandName)
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Reset search
    const handleResetSearch = () => {
        setSearch("")
        fetchBrands()
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-serif text-[#3a2a21]">Quản lý thương hiệu</h1>
                            <p className="text-[#5a483e] mt-2">Quản lý danh sách thương hiệu nước hoa</p>
                        </div>
                        <Link to={ROUTES.ADMIN.PERFUMES}>Quản lý nước hoa-></Link>
                    </div>

                    {/* Search and Add */}
                    <div className="p-6 border-b border-[#d9c7b8]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên thương hiệu..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-3 pl-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]" size={18} />
                            </div>

                            <button
                                onClick={handleResetSearch}
                                className="cursor-pointer flex items-center justify-center p-3 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Đặt lại
                            </button>

                            <button
                                onClick={() => {
                                    setIsAddingNew(true)
                                    setEditingId(null)
                                    reset()
                                }}
                                className="cursor-pointer flex items-center justify-center p-3 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Thêm thương hiệu mới
                            </button>
                        </div>
                    </div>

                    {/* Brands List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-[#a67c52] border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-[#a67c52]">Đang tải dữ liệu...</p>
                            </div>
                        ) : brands.length === 0 ? (
                            <div className="text-center py-12 text-[#5a483e]">
                                <p className="text-lg">Không tìm thấy thương hiệu nào</p>
                                <p className="mt-2">Hãy thử tìm kiếm với từ khóa khác hoặc thêm thương hiệu mới</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f3e9] text-[#3a2a21]">
                                            <th className="p-4 text-left">Tên thương hiệu</th>
                                            <th className="p-4 text-left">Ngày tạo</th>
                                            <th className="p-4 text-left">Cập nhật lần cuối</th>
                                            <th className="p-4 text-left">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brands.map((brand) => (
                                            <tr key={brand._id} className="border-b border-[#d9c7b8] hover:bg-[#f8f3e9]/50">
                                                <td className="p-4 font-medium text-[#3a2a21]">{brand.brandName}</td>
                                                <td className="p-4 text-[#5a483e]">{formatDate(brand.createdAt)}</td>
                                                <td className="p-4 text-[#5a483e]">{formatDate(brand.updatedAt)}</td>
                                                <td className="p-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleStartEdit(brand)}
                                                            className="cursor-pointer p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBrand(brand._id)}
                                                            className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {/* {!loading && brands.length > 0 && pagination.totalPage > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-[#5a483e]">
                                    Hiển thị {brands.length} trên {pagination.totalItem} thương hiệu
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.current - 1)}
                                        disabled={pagination.current === 1}
                                        className={`p-2 rounded-md ${pagination.current === 1
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-[#a67c52] hover:bg-[#f8f3e9]"
                                            }`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-md ${pagination.current === page ? "bg-[#a67c52] text-white" : "text-[#a67c52] hover:bg-[#f8f3e9]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(pagination.current + 1)}
                                        disabled={pagination.current === pagination.totalPage}
                                        className={`p-2 rounded-md ${pagination.current === pagination.totalPage
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-[#a67c52] hover:bg-[#f8f3e9]"
                                            }`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>

                {/* Add New Brand Form */}
                {isAddingNew && (
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Thêm thương hiệu mới</h2>
                            <button onClick={() => setIsAddingNew(false)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitNewBrand)}>
                                <div>
                                    <label className="block text-[#5a483e] mb-2">Tên thương hiệu *</label>
                                    <input
                                        {...register("brandName", {
                                            required: "Vui lòng nhập tên thương hiệu",
                                            minLength: { value: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự" },
                                        })}
                                        className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        placeholder="Nhập tên thương hiệu..."
                                    />
                                    {errors.brandName && <p className="text-red-500 text-sm mt-1">{errors.brandName.message}</p>}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingNew(false)}
                                        className="px-6 py-3 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors mr-4"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                    >
                                        Thêm mới
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Brand Form */}
                {editingId && (
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Chỉnh sửa thương hiệu</h2>
                            <button onClick={() => setEditingId(null)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitEditBrand)}>
                                <div>
                                    <label className="block text-[#5a483e] mb-2">Tên thương hiệu *</label>
                                    <input
                                        {...register("brandName", {
                                            required: "Vui lòng nhập tên thương hiệu",
                                            minLength: { value: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự" },
                                        })}
                                        className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    />
                                    {errors.brandName && <p className="text-red-500 text-sm mt-1">{errors.brandName.message}</p>}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="px-6 py-3 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors mr-4"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminBrandPage

