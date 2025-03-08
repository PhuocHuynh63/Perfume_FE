"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Calendar, Edit2, Save, X, Shield, Clock, Settings } from "lucide-react"
import authService from "@services/auth"
import { useParams, Link } from "react-router-dom"
import { formatDate } from "@helpers/date"
import { toast } from "react-toastify"
import ChangePassword from "@molecules/Modals"

// Define the MODELS interface
namespace MODELS {
    export interface IUser {
        _id: string
        email: string
        name: string
        YOB: number
        gender: string
        isAdmin: boolean
        createdAt: string
        updatedAt: string
    }
}

type FormData = {
    name: string
    YOB: number
    gender: string
}

const ProfilePage = () => {
    //#region get userData
    const { id } = useParams()

    const [userData, setUserData] = useState<MODELS.IUser>({
        _id: "",
        email: "",
        name: "",
        YOB: 0,
        gender: "",
        isAdmin: false,
        createdAt: "",
        updatedAt: "",
    })
    useEffect(() => {
        if (id) {
            authService.getMemberById(id).then((res) => {
                const data = res.data.data
                setUserData(data)
                reset({
                    name: data.name,
                    YOB: data.YOB,
                    gender: data.gender,
                })
            })
        }
    }, [id])
    //#endregion

    //#region handle Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            YOB: 0,
            gender: "",
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            const response = await authService.updateMemberById(id || "", data)
            console.log("Cập nhật thông tin thành công:", response)
            setUserData(response.data.data)

            setIsEditing(false)
            toast.success(response.data.message)
        } catch (error: any) {
            console.error("Lỗi khi cập nhật thông tin:", error)
            toast.error(error.response.data.message)
        }
    }
    //#endregion

    //#region handleEdit
    const [isEditing, setIsEditing] = useState(false)
    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        reset({
            name: userData.name,
            YOB: userData.YOB,
            gender: userData.gender,
        })
    }
    //#endregion

    return (
        <div className="min-h-screen bg-[#fffcf8] py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#f8f3e9] p-8 relative">
                        <div className="flex items-center">
                            <div className="w-24 h-24 bg-[#a67c52] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                                {(userData.name || "").charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-6">
                                <h1 className="text-3xl font-serif text-[#3a2a21]">{userData.name}</h1>
                                <div className="flex items-center mt-2 text-[#5a483e]">
                                    {userData.isAdmin && (
                                        <div className="flex items-center mr-4 text-[#a67c52]">
                                            <Shield size={16} className="mr-1" />
                                            <span>Quản trị viên</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-1" />
                                        <span>Tham gia từ {userData.createdAt ? formatDate(userData.createdAt).split(",")[0] : ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 right-8 flex space-x-3">
                            {/* Admin Button - Only visible for admin users */}
                            {userData.isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    className="cursor-pointer flex items-center px-4 py-2 bg-[#3a2a21] text-white rounded-md hover:bg-[#2a1e18] transition-colors"
                                >
                                    <Settings size={16} className="mr-2" />
                                    Trang quản trị
                                </Link>
                            )}

                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="cursor-pointer flex items-center px-4 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-serif text-[#3a2a21] mb-6">Thông tin cá nhân</h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <User size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Họ và tên</span>
                                        </div>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    {...register("name", { required: "Vui lòng nhập họ và tên" })}
                                                    className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                            </div>
                                        ) : (
                                            <p className="text-[#3a2a21] text-lg">{userData.name}</p>
                                        )}
                                    </div>

                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <Mail size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Email</span>
                                        </div>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    value={userData.email}
                                                    className="disabled:bg-gray-100 w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                    disabled={true}
                                                    placeholder="Email không thể thay đổi"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-[#3a2a21] text-lg">{userData.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <Calendar size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Năm sinh</span>
                                        </div>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="number"
                                                    {...register("YOB", {
                                                        required: "Vui lòng nhập năm sinh",
                                                        min: { value: 1900, message: "Năm sinh không hợp lệ" },
                                                        max: { value: new Date().getFullYear(), message: "Năm sinh không hợp lệ" },
                                                    })}
                                                    className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                                />
                                                {errors.YOB && <p className="text-red-500 text-sm mt-1">{errors.YOB.message}</p>}
                                            </div>
                                        ) : (
                                            <p className="text-[#3a2a21] text-lg">{userData.YOB}</p>
                                        )}
                                    </div>

                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <User size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Giới tính</span>
                                        </div>
                                        {isEditing ? (
                                            <select
                                                {...register("gender", { required: "Vui lòng chọn giới tính" })}
                                                className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                        ) : (
                                            <p className="text-[#3a2a21] text-lg">
                                                {userData.gender === "Male" ? "Nam" : userData.gender === "Female" ? "Nữ" : "Khác"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-2xl font-serif text-[#3a2a21] mb-6">Thông tin tài khoản</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <Clock size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Ngày tạo tài khoản</span>
                                        </div>
                                        <p className="text-[#3a2a21] text-lg">
                                            {userData.createdAt ? formatDate(userData.createdAt) : "N/A"}
                                        </p>
                                    </div>

                                    <div className="border-b border-[#d9c7b8] pb-4">
                                        <div className="flex items-center mb-2">
                                            <Clock size={18} className="text-[#a67c52] mr-2" />
                                            <span className="text-[#5a483e] font-medium">Cập nhật lần cuối</span>
                                        </div>
                                        <p className="text-[#3a2a21] text-lg">
                                            {userData.updatedAt ? formatDate(userData.updatedAt) : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="cursor-pointer flex items-center px-4 py-2 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors"
                                    >
                                        <X size={16} className="mr-2" />
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer flex items-center px-4 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Lưu thay đổi
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="mt-8 max-w-4xl mx-auto">
                    <ChangePassword />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

