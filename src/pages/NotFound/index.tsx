import { Home, Search } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[#fffcf8] flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-serif text-[#3a2a21]">
                        Essence
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                        <Link to="/" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Trang chủ
                        </Link>
                        <Link to="/category" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Bộ sưu tập
                        </Link>
                        <Link to="/about" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Về chúng tôi
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="text-center">
                    <div className="mb-8">
                        <img
                            src="/placeholder.svg?height=200&width=200&text=404"
                            alt="404 Icon"
                            width={200}
                            height={200}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#3a2a21] mb-4">Oops! Trang không tìm thấy</h1>
                    <p className="text-xl text-[#5a483e] mb-8">Có vẻ như bạn đã lạc vào một hương thơm không tồn tại.</p>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                        <button className="bg-[#a67c52] hover:bg-[#8a5a2b] text-white transition-colors">
                            <Link to="/">
                                <Home className="mr-2 h-4 w-4" />
                                Quay về trang chủ
                            </Link>
                        </button>
                        <button
                            className="border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-colors"
                        >
                            <Link to="/category">
                                <Search className="mr-2 h-4 w-4" />
                                Khám phá bộ sưu tập
                            </Link>
                        </button>
                    </div>
                </div>
            </main>

            {/* Suggested Links */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-serif text-center text-[#3a2a21] mb-6">Bạn có thể quan tâm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["Nước hoa nam", "Nước hoa nữ", "Bộ quà tặng"].map((item, index) => (
                            <div key={index} className="bg-[#f8f3e9] rounded-lg p-6 text-center">
                                <h3 className="text-xl font-serif text-[#3a2a21] mb-2">{item}</h3>
                                <p className="text-[#5a483e] mb-4">Khám phá bộ sưu tập {item.toLowerCase()} độc đáo của chúng tôi.</p>
                                <button
                                    className="border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-colors"
                                >
                                    <Link to={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}>Xem ngay</Link>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#2a1f1a] text-[#e8d5c4] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-serif mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/category" className="hover:text-white transition-colors">
                                        Tất cả sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="hover:text-white transition-colors">
                                        Về chúng tôi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-white transition-colors">
                                        Liên hệ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="hover:text-white transition-colors">
                                        Câu hỏi thường gặp
                                    </Link>
                                </li>
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
                                <a href="#" className="hover:text-white transition-colors">
                                    Facebook
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Instagram
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Twitter
                                </a>
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

