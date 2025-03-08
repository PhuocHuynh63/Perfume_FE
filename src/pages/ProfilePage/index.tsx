"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Calendar, Edit2, Save, X, Shield, Clock } from "lucide-react"

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserProfile {
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

const ProfilePage = () => {
    // Dữ liệu người dùng mẫu
    const [userData, setUserData] = useState<UserProfile>({
        _id: "67c66c79f42efaca62a09a98",
        email: "phuochm@gmail.com",
        name: "phuochuynh",
        YOB: 2003,
        gender: "Male",
        isAdmin: true,
        createdAt: "2025-03-04T02:59:05.722Z",
        updatedAt: "2025-03-06T17:04:43.668Z",
        __v: 0,
    })

    // State cho chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState(false)

    // State tạm thời cho dữ liệu đang chỉnh sửa
    const [editData, setEditData] = useState<Partial<UserProfile>>({})

    // Bắt đầu chỉnh sửa
    const handleEdit = () => {
        setEditData({
            name: userData.name,
            email: userData.email,
            YOB: userData.YOB,
            gender: userData.gender,
        })
        setIsEditing(true)
    }

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setIsEditing(false)
        setEditData({})
    }

    // Cập nhật dữ liệu đang chỉnh sửa
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditData({
            ...editData,
            [name]: name === "YOB" ? Number.parseInt(value) : value,
        })
    }

    // Lưu thay đ���i
    const handleSave = async () => {
        try {
            // Giả lập API call
            // const response = await userService.updateProfile(userData._id, editData);

            // Cập nhật dữ liệu người dùng
            setUserData({
                ...userData,
                ...editData,
                updatedAt: new Date().toISOString(),
            })

            setIsEditing(false)
            setEditData({})

            // Hiển thị thông báo thành công
            alert("Cập nhật thông tin thành công!")
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error)
            alert("Có lỗi xảy ra khi cập nhật thông tin!")
        }
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

    return (
        <div className="min-h-screen bg-[#fffcf8] py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#f8f3e9] p-8 relative">
                        <div className="flex items-center">
                            <div className="w-24 h-24 bg-[#a67c52] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                                {userData.name.charAt(0).toUpperCase()}
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
                                        <span>Tham gia từ {formatDate(userData.createdAt).split(",")[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="absolute top-8 right-8 flex items-center px-4 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                            >
                                <Edit2 size={16} className="mr-2" />
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        <h2 className="text-2xl font-serif text-[#3a2a21] mb-6">Thông tin cá nhân</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div className="border-b border-[#d9c7b8] pb-4">
                                    <div className="flex items-center mb-2">
                                        <User size={18} className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5a483e] font-medium">Họ và tên</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name || ""}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        />
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
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email || ""}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        />
                                    ) : (
                                        <p className="text-[#3a2a21] text-lg">{userData.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-6">
                                <div className="border-b border-[#d9c7b8] pb-4">
                                    <div className="flex items-center mb-2">
                                        <Calendar size={18} className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5a483e] font-medium">Năm sinh</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="YOB"
                                            value={editData.YOB || ""}
                                            onChange={handleChange}
                                            placeholder="Enter your year of birth"
                                            className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                        />
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
                                        <>
                                            <label htmlFor="gender" className="sr-only">Giới tính</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={editData.gender || ""}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                        </>
                                    ) : (
                                        <p className="text-[#3a2a21] text-lg">
                                            {userData.gender === "Male" ? "Nam" : userData.gender === "Female" ? "Nữ" : "Khác"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-serif text-[#3a2a21] mb-6">Thông tin tài khoản</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="border-b border-[#d9c7b8] pb-4">
                                    <div className="flex items-center mb-2">
                                        <Clock size={18} className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5a483e] font-medium">Ngày tạo tài khoản</span>
                                    </div>
                                    <p className="text-[#3a2a21] text-lg">{formatDate(userData.createdAt)}</p>
                                </div>

                                <div className="border-b border-[#d9c7b8] pb-4">
                                    <div className="flex items-center mb-2">
                                        <Clock size={18} className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5a483e] font-medium">Cập nhật lần cuối</span>
                                    </div>
                                    <p className="text-[#3a2a21] text-lg">{formatDate(userData.updatedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Buttons */}
                        {isEditing && (
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center px-4 py-2 border border-[#a67c52] text-[#a67c52] rounded-md hover:bg-[#f8f3e9] transition-colors"
                                >
                                    <X size={16} className="mr-2" />
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-4 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                                >
                                    <Save size={16} className="mr-2" />
                                    Lưu thay đổi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

