import { ROUTES } from "@constants/route"
import { CookiesService } from "@helpers/cookies"
import { Link } from "react-router-dom"
import { Outlet } from "react-router-dom"

const MainLayout = () => {

    //#region Cookies
    const isUser = CookiesService.get()
    const handleLogout = () => {
        CookiesService.remove()
    }
    //#endregion

    return (
        <div className="min-h-screen bg-[#fffcf8]">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-serif text-[#3a2a21]">
                        Essence
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                        <Link to="#" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Bộ sưu tập
                        </Link>
                        <Link to="#" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Về chúng tôi
                        </Link>
                        <Link to="#" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Liên hệ
                        </Link>
                    </nav>
                    {!isUser ? (
                        <Link to={ROUTES.AUTH.LOGIN} className="text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                            Đăng nhập
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-6">
                            <Link to={ROUTES.PUBLIC.PROFILE} className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                                Setting
                            </Link>
                            <button onClick={handleLogout} className="cursor-pointer text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </header>
            {/* Admin content */}

            <Outlet />

            {/* Footer */}
            <footer className="bg-[#2a1f1a] text-[#e8d5c4] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-serif mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                <li><Link to="#" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif mb-4">Thông tin liên hệ</h3>
                            <p>123 Đường Nước Hoa</p>
                            <p>Quận 1, TP.HCM</p>
                            <p>Điện thoại: (028) 1234-5678</p>
                            <p>Email: info@essence.com</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif mb-4">Theo dõi chúng tôi</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-[#4a3f3a] text-center">
                        <p>&copy; 2024 Essence. Đã đăng ký bản quyền.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout