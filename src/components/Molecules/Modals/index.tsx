"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Lock, Eye, EyeOff, Save, X } from "lucide-react"
import authService from "@services/auth"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type PasswordFormData = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const ChangePassword = () => {
    const { id } = useParams()
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordFormData>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const handleStartChangingPassword = () => {
        setIsChangingPassword(true)
    }

    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false)
        reset()
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
    }

    const onSubmitPassword = async (data: PasswordFormData) => {
        try {
            const response = await authService.changePassword(id || "", {
                password: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            })

            toast.success(response.data.message || "Đổi mật khẩu thành công")
            setIsChangingPassword(false)
            reset()
        } catch (error: any) {
            console.error("Lỗi khi đổi mật khẩu:", error)
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu")
        }
    }

    return (
        <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-[#3a2a21]">Bảo mật tài khoản</h2>
                    {!isChangingPassword && (
                        <button
                            onClick={handleStartChangingPassword}
                            className="cursor-pointer flex items-center px-4 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a6642] transition-colors"
                        >
                            <Lock size={16} className="mr-2" />
                            Đổi mật khẩu
                        </button>
                    )}
                </div>

                {isChangingPassword ? (
                    <form onSubmit={handleSubmit(onSubmitPassword)}>
                        <div className="space-y-6">
                            {/* Current Password */}
                            <div className="border-b border-[#d9c7b8] pb-4">
                                <div className="flex items-center mb-2">
                                    <Lock size={18} className="text-[#a67c52] mr-2" />
                                    <span className="text-[#5a483e] font-medium">Mật khẩu hiện tại</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        {...register("currentPassword", {
                                            required: "Vui lòng nhập mật khẩu hiện tại",
                                        })}
                                        className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="border-b border-[#d9c7b8] pb-4">
                                <div className="flex items-center mb-2">
                                    <Lock size={18} className="text-[#a67c52] mr-2" />
                                    <span className="text-[#5a483e] font-medium">Mật khẩu mới</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        {...register("newPassword", {
                                            required: "Vui lòng nhập mật khẩu mới",
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        })}
                                        className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="border-b border-[#d9c7b8] pb-4">
                                <div className="flex items-center mb-2">
                                    <Lock size={18} className="text-[#a67c52] mr-2" />
                                    <span className="text-[#5a483e] font-medium">Xác nhận mật khẩu mới</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Vui lòng xác nhận mật khẩu mới",
                                            validate: (value) => value === watch("newPassword") || "Mật khẩu xác nhận không khớp",
                                        })}
                                        className="w-full p-2 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a67c52]"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCancelPasswordChange}
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
                    </form>
                ) : (
                    <div className="text-[#5a483e]">
                        <p>Bạn có thể thay đổi mật khẩu để bảo vệ tài khoản của mình.</p>
                        <p className="mt-2">Mật khẩu mạnh nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChangePassword

