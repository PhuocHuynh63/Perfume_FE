import { useState } from "react";
import { Sparkles, Mail, Lock, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import authService from "@services/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROUTES } from "@constants/route";

type RegisterInputs = {
    email: string;
    password: string;
    name: string;
    YOB: number;
    gender: string;
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInputs>();

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        try {
            setDisable(true);
            const res: any = await authService.register(data);
            toast.success(res.data.message);
            navigate(ROUTES.AUTH.LOGIN);
        } catch (error: any) {
            setDisable(true);
            toast.error(error.response.data.message);
            setTimeout(() => setDisable(false), 2000);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#fffcf8]">
            {/* Left side - decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#f8f3e9] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8f3e9]/80 to-[#f8f3e9]/40 z-10"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#3a2a21] mb-6">
                        Khám phá <span className="italic font-normal">Hương thơm</span>
                    </h1>
                    <p className="text-[#5a483e] text-center max-w-md text-lg">
                        "Mỗi giọt nước hoa là một câu chuyện, một ký ức, một cảm xúc. Hãy viết câu chuyện của bạn cùng Essence."
                    </p>
                </div>
            </div>

            {/* Right side - register form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-medium text-[#3a2a21]">Đăng ký tài khoản</h2>
                        <p className="mt-2 text-sm text-[#8a7267]">Tạo tài khoản để khám phá thế giới hương thơm độc đáo</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register("email", { required: "Email không được để trống" })}
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label>Mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password", { required: "Mật khẩu không được để trống" })}
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label>Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        {...register("name", { required: "Tên không được để trống" })}
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* YOB */}
                            <div className="space-y-2">
                                <label>Năm sinh</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        type="number"
                                        placeholder="1990"
                                        {...register("YOB", { required: "Vui lòng nhập năm sinh" })}
                                        className="w-full pl-10"
                                    />
                                </div>
                                {errors.YOB && <p className="text-red-500 text-sm">{errors.YOB.message}</p>}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label>Giới tính</label>
                                <div className="flex items-center space-x-4">
                                    <label>
                                        <input type="radio" value="Male" {...register("gender", { required: "Vui lòng chọn giới tính" })} />
                                        Male
                                    </label>
                                    <label>
                                        <input type="radio" value="Female" {...register("gender")} />
                                        Female
                                    </label>
                                </div>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={disable}
                            className="w-full cursor-pointer bg-[#a67c52] hover:bg-[#8a5a2b] text-white flex items-center justify-center gap-2 h-12 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Sparkles className="h-4 w-4" />
                            Đăng ký
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-[#8a7267]">Đã có tài khoản?</span>{" "}
                            <Link to="/auth/login" className="font-medium text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
