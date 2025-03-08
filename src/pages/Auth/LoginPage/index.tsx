import { useState } from "react"
import { Sparkles, Lock, Mail } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import authService from "@services/auth"
import { CookiesService } from "@helpers/cookies"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "@constants/route"
import { toast } from "react-toastify"

type Inputs = {
    email: string
    password: string
}


const PerfumeLogin = () => {
    const navigate = useNavigate()
    const [disable, setDisable] = useState(false)
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
        try {
            setDisable(true);
            const res: any = await authService.login(data);
            CookiesService.set(res.data.data.accessToken);
            toast.success(res.data.message);
            navigate(ROUTES.PUBLIC.HOME);
        } catch (error: any) {
            setDisable(true);
            toast.error(error.response.data.message);
            setTimeout(() => {
                setDisable(false);
            }, 2000);
        }
    }

    return (
        <div className="flex min-h-screen w-full">
            {/* Left side - decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#f8f3e9] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8f3e9]/80 to-[#f8f3e9]/40 z-10"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-[#3a2a21] mb-6">
                        Essence of <span className="italic font-normal">Elegance</span>
                    </h1>
                    <p className="text-[#5a483e] text-center max-w-md text-lg">
                        "A perfume is like a piece of clothing, a message, a way of presenting oneself... a costume that differs
                        according to the woman who wears it."
                    </p>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-medium text-[#3a2a21]">Welcome Back</h2>
                        <p className="mt-2 text-sm text-[#8a7267]">Sign in to your account to explore our exclusive collection</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[#5a483e]">
                                    Username
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        id="email"
                                        type="text"
                                        placeholder="phuochuynhvipprono1"
                                        {...register("email")}
                                        required
                                        className="w-full h-11 pl-10 rounded-md border-[#d9bfa9] focus:border-[#c8a992] focus:ring-[#c8a992]"
                                        style={{ borderWidth: 1 }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-[#5a483e]">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7267]" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        required
                                        className="w-full h-11 pl-10 rounded-md border-[#d9bfa9] focus:border-[#c8a992] focus:ring-[#c8a992]"
                                        style={{ borderWidth: 1 }}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <a href="#" className="text-xs text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="disabled:opacity-30 w-full py-2 rounded-md cursor-pointer bg-[#a67c52] hover:bg-[#8a5a2b] text-white flex items-center justify-center gap-2"
                            disabled={disable}
                        >
                            <Sparkles className="h-4 w-4" />
                            Sign in
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-[#8a7267]">Don't have an account?</span>{" "}
                            <Link to={ROUTES.AUTH.REGISTER} className="font-medium text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PerfumeLogin