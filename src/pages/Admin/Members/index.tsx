import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
    Search,
    Plus,
    Edit,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Shield,
    ShieldOff,
    Eye,
    EyeOff,
} from "lucide-react"
import { toast } from "react-toastify"
import authService from "@services/auth"

// Define interfaces
interface Member {
    _id: string
    email: string
    name: string
    YOB: number
    gender: string
    isAdmin: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

interface MemberFormData {
    email: string
    name: string
    YOB: number
    gender: string
    password?: string
    confirmPassword?: string
    isAdmin: boolean
}

const AdminMemberPage = () => {
    // State for members list
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        totalPage: 1,
        totalItem: 0,
    })

    // State for search
    const [search, setSearch] = useState("")

    // State for form management
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<MemberFormData>({
        defaultValues: {
            isAdmin: false,
        },
    })

    // Watch password for confirmation validation
    const password = watch("password")

    // Fetch members
    const fetchMembers = async () => {
        setLoading(true)
        try {
            const response = await authService.getAllMember()
            setMembers(response.data.data || [])
        } catch (error) {
            console.error("Error fetching members:", error)
            toast.error("Không thể tải danh sách thành viên")
        } finally {
            setLoading(false)
        }
    }

    // Initial data load
    useEffect(() => {
        fetchMembers()
    }, [])

    // Handle form submission for new member
    const onSubmitNewMember = async (data: MemberFormData) => {
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...submitData } = data

            // await authService.createMember(submitData)
            toast.success("Thêm thành viên mới thành công")
            setIsAddingNew(false)
            reset()
            fetchMembers()
        } catch (error) {
            console.error("Error creating member:", error)
            toast.error("Không thể thêm thành viên mới")
        }
    }

    // Handle form submission for editing member
    const onSubmitEditMember = async (data: MemberFormData) => {
        if (!editingId) return

        try {
            // Remove password and confirmPassword if they are empty
            const submitData: Partial<MemberFormData> = { ...data }
            if (!submitData.password) {
                delete submitData.password
                delete submitData.confirmPassword
            } else {
                delete submitData.confirmPassword
            }

            // await authService.updateMember(editingId, submitData)
            toast.success("Cập nhật thành viên thành công")
            setEditingId(null)
            fetchMembers()
        } catch (error) {
            console.error("Error updating member:", error)
            toast.error("Không thể cập nhật thành viên")
        }
    }

    // Handle delete member
    const handleDeleteMember = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return

        try {
            // await authService.deleteMember(id)
            toast.success("Xóa thành viên thành công")
            fetchMembers()
        } catch (error) {
            console.error("Error deleting member:", error)
            toast.error("Không thể xóa thành viên")
        }
    }

    // Toggle admin status
    const handleToggleAdmin = async (member: Member) => {
        try {
            // await authService.updateMember(member._id, { isAdmin: !member.isAdmin })
            toast.success(`${member.name} ${member.isAdmin ? "không còn" : "đã trở thành"} quản trị viên`)
            fetchMembers()
        } catch (error) {
            console.error("Error toggling admin status:", error)
            toast.error("Không thể thay đổi quyền quản trị")
        }
    }

    // Start editing a member
    const handleStartEdit = (member: Member) => {
        setEditingId(member._id)
        setValue("email", member.email)
        setValue("name", member.name)
        setValue("YOB", member.YOB)
        setValue("gender", member.gender)
        setValue("isAdmin", member.isAdmin)
        // Clear password fields when editing
        setValue("password", "")
        setValue("confirmPassword", "")

        // Scroll to the edit form
        setTimeout(() => {
            document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
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
        fetchMembers()
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#f8f3e9] p-6">
                        <h1 className="text-3xl font-serif text-[#3a2a21]">Quản lý thành viên</h1>
                        <p className="text-[#5a483e] mt-2">Quản lý danh sách thành viên và phân quyền</p>
                    </div>

                    {/* Search and Add */}
                    <div className="p-6 border-b border-[#d9c7b8]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-3 pl-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]" size={18} />
                            </div>

                            <button
                                onClick={handleResetSearch}
                                className="flex items-center justify-center p-3 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Đặt lại
                            </button>

                            <button
                                onClick={() => {
                                    setIsAddingNew(true)
                                    setEditingId(null)
                                    reset({
                                        email: "",
                                        name: "",
                                        YOB: new Date().getFullYear() - 18,
                                        gender: "Male",
                                        password: "",
                                        confirmPassword: "",
                                        isAdmin: false,
                                    })
                                    setTimeout(() => {
                                        document.getElementById("add-form")?.scrollIntoView({ behavior: "smooth" })
                                    }, 100)
                                }}
                                className="flex items-center justify-center p-3 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Thêm thành viên mới
                            </button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-[#a67c52] border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-[#a67c52]">Đang tải dữ liệu...</p>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-12 text-[#5a483e]">
                                <p className="text-lg">Không tìm thấy thành viên nào</p>
                                <p className="mt-2">Hãy thử tìm kiếm với từ khóa khác hoặc thêm thành viên mới</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f3e9] text-[#3a2a21]">
                                            <th className="p-4 text-left">Tên</th>
                                            <th className="p-4 text-left">Email</th>
                                            <th className="p-4 text-left">Năm sinh</th>
                                            <th className="p-4 text-left">Giới tính</th>
                                            <th className="p-4 text-left">Vai trò</th>
                                            <th className="p-4 text-left">Ngày tạo</th>
                                            <th className="p-4 text-left">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => (
                                            <tr key={member._id} className="border-b border-[#d9c7b8] hover:bg-[#f8f3e9]/50">
                                                <td className="p-4 font-medium text-[#3a2a21]">{member.name}</td>
                                                <td className="p-4 text-[#5a483e]">{member.email}</td>
                                                <td className="p-4 text-[#5a483e]">{member.YOB}</td>
                                                <td className="p-4 text-[#5a483e]">
                                                    {member.gender === "Male" ? "Nam" : member.gender === "Female" ? "Nữ" : "Khác"}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.isAdmin ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                                                            }`}
                                                    >
                                                        {member.isAdmin ? "Quản trị viên" : "Thành viên"}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[#5a483e]">{formatDate(member.createdAt)}</td>
                                                <td className="p-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleToggleAdmin(member)}
                                                            className={`p-2 rounded-md transition-colors ${member.isAdmin ? "text-amber-600 hover:bg-amber-50" : "text-blue-600 hover:bg-blue-50"
                                                                }`}
                                                            title={member.isAdmin ? "Hủy quyền quản trị" : "Cấp quyền quản trị"}
                                                        >
                                                            {member.isAdmin ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStartEdit(member)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMember(member._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                        {/* {!loading && members.length > 0 && pagination.totalPage > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-[#5a483e]">
                                    Hiển thị {members.length} trên {pagination.totalItem} thành viên
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

                {/* Add New Member Form */}
                {isAddingNew && (
                    <div id="add-form" className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Thêm thành viên mới</h2>
                            <button onClick={() => setIsAddingNew(false)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitNewMember)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Email *</label>
                                            <input
                                                type="email"
                                                {...register("email", {
                                                    required: "Vui lòng nhập email",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Email không hợp lệ",
                                                    },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                placeholder="example@email.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Họ và tên *</label>
                                            <input
                                                {...register("name", {
                                                    required: "Vui lòng nhập họ và tên",
                                                    minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                placeholder="Nguyễn Văn A"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Năm sinh *</label>
                                            <input
                                                type="number"
                                                {...register("YOB", {
                                                    required: "Vui lòng nhập năm sinh",
                                                    min: { value: 1900, message: "Năm sinh không hợp lệ" },
                                                    max: { value: new Date().getFullYear() - 10, message: "Thành viên phải trên 10 tuổi" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.YOB && <p className="text-red-500 text-sm mt-1">{errors.YOB.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Giới tính *</label>
                                            <select
                                                {...register("gender", { required: "Vui lòng chọn giới tính" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Mật khẩu *</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register("password", {
                                                        required: "Vui lòng nhập mật khẩu",
                                                        minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                                                        pattern: {
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                                            message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
                                                        },
                                                    })}
                                                    className="w-full p-3 pr-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Xác nhận mật khẩu *</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...register("confirmPassword", {
                                                        required: "Vui lòng xác nhận mật khẩu",
                                                        validate: (value) => value === password || "Mật khẩu xác nhận không khớp",
                                                    })}
                                                    className="w-full p-3 pr-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    {...register("isAdmin")}
                                                    className="w-4 h-4 text-[#a67c52] border-[#d9c7b8] rounded focus:ring-[#a67c52]"
                                                />
                                                <span className="ml-2 text-[#5a483e]">Cấp quyền quản trị viên</span>
                                            </label>
                                        </div>
                                    </div>
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

                {/* Edit Member Form */}
                {editingId && (
                    <div id="edit-form" className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#f8f3e9] p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-[#3a2a21]">Chỉnh sửa thành viên</h2>
                            <button onClick={() => setEditingId(null)} className="text-[#a67c52] hover:text-[#8a6642]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmitEditMember)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Email *</label>
                                            <input
                                                type="email"
                                                {...register("email", {
                                                    required: "Vui lòng nhập email",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Email không hợp lệ",
                                                    },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Họ và tên *</label>
                                            <input
                                                {...register("name", {
                                                    required: "Vui lòng nhập họ và tên",
                                                    minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Năm sinh *</label>
                                            <input
                                                type="number"
                                                {...register("YOB", {
                                                    required: "Vui lòng nhập năm sinh",
                                                    min: { value: 1900, message: "Năm sinh không hợp lệ" },
                                                    max: { value: new Date().getFullYear() - 10, message: "Thành viên phải trên 10 tuổi" },
                                                })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            />
                                            {errors.YOB && <p className="text-red-500 text-sm mt-1">{errors.YOB.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Giới tính *</label>
                                            <select
                                                {...register("gender", { required: "Vui lòng chọn giới tính" })}
                                                className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Mật khẩu (để trống nếu không thay đổi)</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register("password", {
                                                        minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                                                        pattern: {
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                                            message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
                                                        },
                                                    })}
                                                    className="w-full p-3 pr-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[#5a483e] mb-2">Xác nhận mật khẩu</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...register("confirmPassword", {
                                                        validate: (value) => !password || value === password || "Mật khẩu xác nhận không khớp",
                                                    })}
                                                    className="w-full p-3 pr-10 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    {...register("isAdmin")}
                                                    className="w-4 h-4 text-[#a67c52] border-[#d9c7b8] rounded focus:ring-[#a67c52]"
                                                />
                                                <span className="ml-2 text-[#5a483e]">Cấp quyền quản trị viên</span>
                                            </label>
                                        </div>
                                    </div>
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

export default AdminMemberPage

