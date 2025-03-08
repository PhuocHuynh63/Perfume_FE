import { useState, useEffect, Fragment } from "react"
import { useForm } from "react-hook-form"
import { Search, Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, RefreshCw, Eye } from "lucide-react"
import perfumeService from "@services/perfumes"
import brandService from "@services/brand"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { ROUTES } from "@constants/route"

// Define interfaces
interface Brand {
    _id: string
    brandName: string
}

interface Comment {
    rating: number
    content: string
    author: string
    _id: string
    createdAt: string
    updatedAt: string
}

interface Perfume {
    _id: string
    perfumeName: string
    uri: string
    price: number
    concentration: string
    description: string
    ingredients: string
    volume: number
    targetAudience: string
    comments: Comment[]
    brand: {
        _id: string
        brandName: string
    }
    createdAt: string
    updatedAt: string
}

interface PerfumeFormData {
    perfumeName: string
    uri: string
    price: number
    concentration: string
    description: string
    ingredients: string
    volume: number
    targetAudience: string
    brand: string
}

const AdminPerfumePage = () => {
    //#region State
    // State for perfumes list
    const [perfumes, setPerfumes] = useState<MODELS.IPerfume[]>([])
    const [loading, setLoading] = useState(true)
    const [brands, setBrands] = useState<MODELS.IBrand[]>([])

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        totalPage: 1,
        totalItem: 0,
    })

    // State for search and filters
    const [search, setSearch] = useState("")
    const [selectedBrand, setSelectedBrand] = useState<string | ''>('')

    // State for form management
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [viewingId, setViewingId] = useState<string | null>(null)
    //#endregion

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<PerfumeFormData>()

    //#region fetchPerfumes
    // Fetch perfumes
    const fetchPerfumes = async (page = 1) => {
        setLoading(true)
        try {
            const response = await perfumeService.findPerfumeByName(search, selectedBrand, page)

            setPerfumes(response.data.data.data || [])
            setPagination(
                response.data.data.pagination || {
                    current: 1,
                    pageSize: 10,
                    totalPage: 1,
                    totalItem: 0,
                },
            )
        } catch (error) {
            console.error("Error fetching perfumes:", error)
            toast.error("Không thể tải danh sách nước hoa")
        } finally {
            setLoading(false)
        }
    }
    //#endregion

    //#region Fetch brands
    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await brandService.findAllBrand()
            setBrands(response.data.data.data || [])
        } catch (error) {
            console.error("Error fetching brands:", error)
            toast.error("Không thể tải danh sách thương hiệu")
        }
    }
    //#endregion

    //#region useEffect
    // Initial data load
    useEffect(() => {
        fetchBrands()
        fetchPerfumes()
    }, [])

    // Refetch when search or filters change
    useEffect(() => {
        fetchPerfumes(1)
    }, [search, selectedBrand])
    //#endregion

    // Handle form submission for new perfume
    const onSubmitNewPerfume = async (data: PerfumeFormData) => {
        try {
            await perfumeService.createPerfume(data)
            toast.success("Thêm nước hoa mới thành công")
            setIsAddingNew(false)
            reset()
            fetchPerfumes()
        } catch (error) {
            console.error("Error creating perfume:", error)
            toast.error("Không thể thêm nước hoa mới")
        }
    }

    // Handle form submission for editing perfume
    const onSubmitEditPerfume = async (data: PerfumeFormData) => {
        if (!editingId) return

        try {
            const res = await perfumeService.updatePerfume(editingId, data)
            toast.success(res.data.message)
            setEditingId(null)
            fetchPerfumes()
        } catch (error) {
            console.error("Error updating perfume:", error)
            toast.error(`${error.response.data.message || "Không thể cập nhật nước hoa"}`)
        }
    }

    // Handle delete perfume
    const handleDeletePerfume = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa nước hoa này?")) return
        console.log("Deleting perfume:", id);

        try {
            const res = await perfumeService.deletePerfume(id)
            toast.success(res.data.message)
            fetchPerfumes()
        } catch (error) {
            console.error("Error deleting perfume:", error)
            toast.error(error.response.data.message || "Không thể xóa nước hoa")
        }
    }

    // Start editing a perfume
    const handleStartEdit = (perfume: Perfume) => {
        setEditingId(perfume._id)
        setValue("perfumeName", perfume.perfumeName)
        setValue("uri", perfume.uri)
        setValue("price", perfume.price)
        setValue("concentration", perfume.concentration)
        setValue("description", perfume.description)
        setValue("ingredients", perfume.ingredients)
        setValue("volume", perfume.volume)
        setValue("targetAudience", perfume.targetAudience)
        setValue("brand", perfume.brand._id)

        // Scroll to the edit form
        setTimeout(() => {
            document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }

    // View perfume details
    const handleViewDetails = (id: string) => {
        setViewingId(viewingId === id ? null : id)
    }

    // Format currency
    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price * 1000)
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

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchPerfumes(page)
    }

    // Reset filters
    const handleResetFilters = () => {
        setSearch("")
        setSelectedBrand('')
        fetchPerfumes(1)
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-serif text-[#3a2a21]">Quản lý nước hoa</h1>
                            <p className="text-[#5a483e] mt-2">Quản lý danh sách sản phẩm nước hoa</p>
                        </div>
                        <Link to={ROUTES.ADMIN.BRANDS}>Manage Brands -></Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="p-6 border-b border-[#d9c7b8]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên nước hoa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-3 pl-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]" size={18} />
                            </div>

                            <div className="w-full md:w-64">
                                <select
                                    value={selectedBrand || ""}
                                    onChange={(e) => setSelectedBrand(e.target.value || '')}
                                    className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    aria-label="Chọn thương hiệu"
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center justify-center p-3 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors"
                                title="Đặt lại"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Đặt lại
                                <button
                                    onClick={() => {
                                        setIsAddingNew(true)
                                        setEditingId(null)
                                        reset()
                                        setTimeout(() => {
                                            document.getElementById("add-form")?.scrollIntoView({ behavior: "smooth" })
                                        }, 100)
                                    }}
                                    className="flex items-center justify-center p-3 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                    title="Thêm nước hoa mới"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Thêm nước hoa mới
                                </button>
                                Thêm nước hoa mới
                            </button>
                        </div>
                    </div>

                    {/* Perfumes List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-[#a67c52] border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-[#a67c52]">Đang tải dữ liệu...</p>
                            </div>
                        ) : perfumes.length === 0 ? (
                            <div className="text-center py-12 text-[#5a483e]">
                                <p className="text-lg">Không tìm thấy nước hoa nào</p>
                                <p className="mt-2">Hãy thử tìm kiếm với từ khóa khác hoặc thêm nước hoa mới</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f3e9] text-[#3a2a21]">
                                            <th className="p-3 text-left">Hình ảnh</th>
                                            <th className="p-3 text-left">Tên nước hoa</th>
                                            <th className="p-3 text-left">Thương hiệu</th>
                                            <th className="p-3 text-left">Giá</th>
                                            <th className="p-3 text-left">Dung tích</th>
                                            <th className="p-3 text-left">Đối tượng</th>
                                            <th className="p-3 text-left">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {perfumes.map((perfume) => (
                                            <Fragment key={perfume._id}>
                                                <tr className="border-b border-[#d9c7b8] hover:bg-[#f8f3e9]/50">
                                                    <td className="p-3">
                                                        <img
                                                            src={perfume.uri || "/placeholder.svg"}
                                                            alt={perfume.perfumeName}
                                                            className="w-16 h-16 object-cover rounded-md"
                                                        />
                                                    </td>
                                                    <td className="p-3 font-medium text-[#3a2a21]">{perfume.perfumeName}</td>
                                                    <td className="p-3 text-[#5a483e]">{perfume.brand.brandName}</td>
                                                    <td className="p-3 text-[#a67c52] font-medium">{formatCurrency(perfume.price)}</td>
                                                    <td className="p-3 text-[#5a483e]">{perfume.volume} ml</td>
                                                    <td className="p-3 text-[#5a483e]">
                                                        {perfume.targetAudience === "male"
                                                            ? "Nam"
                                                            : perfume.targetAudience === "female"
                                                                ? "Nữ"
                                                                : "Unisex"}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleViewDetails(perfume._id)}
                                                                className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStartEdit(perfume)}
                                                                className="cursor-pointer p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePerfume(perfume._id)}
                                                                className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Detail view */}
                                                {viewingId === perfume._id && (
                                                    <tr>
                                                        <td colSpan={7} className="p-0">
                                                            <div className="bg-[#f8f3e9]/30 p-6 border-b border-[#d9c7b8]">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <h3 className="text-xl font-serif text-[#3a2a21] mb-4">Thông tin chi tiết</h3>
                                                                        <div className="space-y-3">
                                                                            <p>
                                                                                <span className="font-medium text-[#5a483e]">Nồng độ:</span>{" "}
                                                                                {perfume.concentration}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium text-[#5a483e]">Mô tả:</span> {perfume.description}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium text-[#5a483e]">Thành phần:</span>{" "}
                                                                                {perfume.ingredients}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium text-[#5a483e]">Ngày tạo:</span>{" "}
                                                                                {formatDate(perfume.createdAt)}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium text-[#5a483e]">Cập nhật lần cuối:</span>{" "}
                                                                                {formatDate(perfume.updatedAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h3 className="text-xl font-serif text-[#3a2a21] mb-4">
                                                                            Đánh giá ({perfume.comments.length})
                                                                        </h3>
                                                                        {perfume.comments.length === 0 ? (
                                                                            <p className="text-[#5a483e]">Chưa có đánh giá nào</p>
                                                                        ) : (
                                                                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                                                                {perfume.comments.map((comment) => (
                                                                                    <div key={comment._id} className="bg-white p-4 rounded-md shadow-sm">
                                                                                        <div className="flex items-center mb-2">
                                                                                            <div className="flex">
                                                                                                {Array.from({ length: comment.rating }).map((_, i) => (
                                                                                                    <span key={i} className="text-yellow-500">
                                                                                                        ★
                                                                                                    </span>
                                                                                                ))}
                                                                                                {Array.from({ length: 3 - comment.rating }).map((_, i) => (
                                                                                                    <span key={i} className="text-gray-300">
                                                                                                        ★
                                                                                                    </span>
                                                                                                ))}
                                                                                            </div>
                                                                                            <span className="ml-2 text-sm text-[#5a483e]">
                                                                                                {formatDate(comment.createdAt)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-[#3a2a21]">{comment.content}</p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && perfumes.length > 0 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-[#5a483e]">
                                    Hiển thị {perfumes.length} trên {pagination.totalItem} sản phẩm
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
                        )}
                    </div>
                </div>

                {/* Add New Perfume Form */}
                {isAddingNew && (
                    <div id="add-form" className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Thêm nước hoa mới</h2>
                            <button onClick={() => setIsAddingNew(false)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitNewPerfume)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Tên nước hoa *</label>
                                            <input
                                                {...register("perfumeName", { required: "Vui lòng nhập tên nước hoa" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.perfumeName && <p className="text-red-500 text-sm mt-1">{errors.perfumeName.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">URL Hình ảnh *</label>
                                            <input
                                                {...register("uri", { required: "Vui lòng nhập URL hình ảnh" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.uri && <p className="text-red-500 text-sm mt-1">{errors.uri.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Giá (nghìn đồng) *</label>
                                            <input
                                                type="number"
                                                {...register("price", {
                                                    required: "Vui lòng nhập giá",
                                                    min: { value: 1, message: "Giá phải lớn hơn 0" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Dung tích (ml) *</label>
                                            <input
                                                type="number"
                                                {...register("volume", {
                                                    required: "Vui lòng nhập dung tích",
                                                    min: { value: 1, message: "Dung tích phải lớn hơn 0" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.volume && <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Thương hiệu *</label>
                                            <select
                                                {...register("brand", { required: "Vui lòng chọn thương hiệu" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn thương hiệu</option>
                                                {brands.map((brand) => (
                                                    <option key={brand._id} value={brand._id}>
                                                        {brand.brandName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Nồng độ *</label>
                                            <select
                                                {...register("concentration", { required: "Vui lòng chọn nồng độ" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn nồng độ</option>
                                                <option value="Eau Fraiche">Eau Fraiche</option>
                                                <option value="Eau de Cologne">Eau de Cologne</option>
                                                <option value="Eau de Toilette">Eau de Toilette</option>
                                                <option value="Eau de Parfum">Eau de Parfum</option>
                                                <option value="Parfum">Parfum</option>
                                                <option value="Extrait">Extrait</option>
                                            </select>
                                            {errors.concentration && (
                                                <p className="text-red-500 text-sm mt-1">{errors.concentration.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Đối tượng *</label>
                                            <select
                                                {...register("targetAudience", { required: "Vui lòng chọn đối tượng" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn đối tượng</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="unisex">Unisex</option>
                                            </select>
                                            {errors.targetAudience && (
                                                <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Thành phần *</label>
                                            <input
                                                {...register("ingredients", { required: "Vui lòng nhập thành phần" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                placeholder="VD: Hoa hồng, Gỗ đàn hương, Vani..."
                                            />
                                            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-[#5a483e] mb-2">Mô tả *</label>
                                    <textarea
                                        {...register("description", { required: "Vui lòng nhập mô tả" })}
                                        rows={4}
                                        className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        placeholder="Mô tả chi tiết về nước hoa..."
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
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

                {/* Edit Perfume Form */}
                {editingId && (
                    <div id="edit-form" className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Chỉnh sửa nước hoa</h2>
                            <button onClick={() => setEditingId(null)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitEditPerfume)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Tên nước hoa *</label>
                                            <input
                                                {...register("perfumeName", { required: "Vui lòng nhập tên nước hoa" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.perfumeName && <p className="text-red-500 text-sm mt-1">{errors.perfumeName.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">URL Hình ảnh *</label>
                                            <input
                                                {...register("uri", { required: "Vui lòng nhập URL hình ảnh" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.uri && <p className="text-red-500 text-sm mt-1">{errors.uri.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Giá (nghìn đồng) *</label>
                                            <input
                                                type="number"
                                                {...register("price", {
                                                    required: "Vui lòng nhập giá",
                                                    min: { value: 1, message: "Giá phải lớn hơn 0" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Dung tích (ml) *</label>
                                            <input
                                                type="number"
                                                {...register("volume", {
                                                    required: "Vui lòng nhập dung tích",
                                                    min: { value: 1, message: "Dung tích phải lớn hơn 0" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.volume && <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Thương hiệu *</label>
                                            <select
                                                {...register("brand", { required: "Vui lòng chọn thương hiệu" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn thương hiệu</option>
                                                {brands.map((brand) => (
                                                    <option key={brand._id} value={brand._id}>
                                                        {brand.brandName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Nồng độ *</label>
                                            <select
                                                {...register("concentration", { required: "Vui lòng chọn nồng độ" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn nồng độ</option>
                                                <option value="Eau Fraiche">Eau Fraiche</option>
                                                <option value="Eau de Cologne">Eau de Cologne</option>
                                                <option value="Eau de Toilette">Eau de Toilette</option>
                                                <option value="Eau de Parfum">Eau de Parfum</option>
                                                <option value="Parfum">Parfum</option>
                                                <option value="Extrait">Extrait</option>
                                            </select>
                                            {errors.concentration && (
                                                <p className="text-red-500 text-sm mt-1">{errors.concentration.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Đối tượng *</label>
                                            <select
                                                {...register("targetAudience", { required: "Vui lòng chọn đối tượng" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="">Chọn đối tượng</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="unisex">Unisex</option>
                                            </select>
                                            {errors.targetAudience && (
                                                <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Thành phần *</label>
                                            <input
                                                {...register("ingredients", { required: "Vui lòng nhập thành phần" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                placeholder="VD: Hoa hồng, Gỗ đàn hương, Vani..."
                                            />
                                            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-[#5a483e] mb-2">Mô tả *</label>
                                    <textarea
                                        {...register("description", { required: "Vui lòng nhập mô tả" })}
                                        rows={4}
                                        className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        placeholder="Mô tả chi tiết về nước hoa..."
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
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

export default AdminPerfumePage

