import { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import perfumeService from "@services/perfumes"
import { ROUTES } from "@constants/route"
import brandService from "@services/brand"

const ProductCard = ({ product }: { product: MODELS.IPerfume }) => (
    <Link to={product._id ? ROUTES.PUBLIC.DETAILPRODUCT.replace(':id', product._id) : '#'} className="cursor-pointer bg-white rounded-lg p-6 shadow-md transition-transform hover:scale-105">
        <div className="relative h-48 mb-4 flex justify-center items-center">
            <img
                src={product?.uri}
                alt={product?.perfumeName}
                className=" w-48 rounded-md"
            />
        </div>
        <h3 className="text-lg font-serif text-[#3a2a21] mb-2">{product?.perfumeName}</h3>
        <div className="flex justify-between items-center">
            <span className="text-[#5a483e] mb-2">{product?.brand?.brandName}</span>
            <span className="text-[#5a483e] mb-2">{product?.targetAudience}</span>
        </div>

        <div className="flex justify-between items-center">
            <span className="text-[#a67c52] font-semibold">${product?.price?.toLocaleString("vi-VN")}</span>
            <button
                className="cursor-pointer rounded-md py-1 px-1.5 border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-colors"
            >
                Xem chi tiết
            </button>
        </div>
    </Link>
)

const CategoryPage = () => {

    const { slug } = useParams()
    const [selectedBrands, setSelectedBrands] = useState("")

    //#region Get all products by name and brand
    const [searchTerm, setSearchTerm] = useState("")
    const [product, setProduct] = useState([])
    useEffect(() => {
        perfumeService.findPerfumeByName(searchTerm, selectedBrands)
            .then((res) => {
                setProduct(res.data.data.data)
            })
    }, [searchTerm, selectedBrands])
    //#endregion

    //#region Get all brands
    const [brands, setBrands] = useState<MODELS.IBrand[]>(
        [{
            _id: "",
            brandName: "",
        }]
    )
    useEffect(() => {
        brandService.findAllBrand()
            .then((res) => {
                setBrands(res.data.data)
            })
    }, [])
    //#endregion

    const handleBrandChange = (brand) => {
        setSelectedBrands(brand)
    }
    console.log(selectedBrands);


    // const clearFilters = () => {
    //     setSelectedBrands([])
    //     setSearchTerm("")
    // }

    return (
        <div className="min-h-screen bg-[#fffcf8]">
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
                        <Link to="#" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Bộ sưu tập
                        </Link>
                        <Link to="#" className="text-[#5a483e] hover:text-[#a67c52] transition-colors">
                            Liên hệ
                        </Link>
                    </nav>
                    <Link to="/cart" className="text-[#a67c52] hover:text-[#8a5a2b] transition-colors">
                        Giỏ hàng
                    </Link>
                </div>
            </header>

            {/* Category Title */}
            <div className="bg-[#f8f3e9] py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-serif text-[#3a2a21] text-center">
                        {slug ? `Danh mục: ${slug}` : "Tất cả sản phẩm"}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filter (Desktop) */}
                    <div className="hidden md:block w-64 space-y-6">
                        <div>
                            <h2 className="text-xl font-serif text-[#3a2a21] mb-4">Lọc sản phẩm</h2>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-4"
                            />
                            <div className="space-y-2">
                                {brands.map((brand) => (
                                    <div key={brand._id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`brand-${brand._id}`}
                                            checked={brand._id ? selectedBrands.includes(brand._id) : false}
                                            onChange={() => handleBrandChange(brand._id)}
                                            className="w-4 h-4 accent-[#a67c52] cursor-pointer"
                                        />
                                        <label htmlFor={`brand-${brand._id}`} className="ml-2 text-[#5a483e]">
                                            {brand.brandName}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {/* {(selectedBrands.length > 0 || searchTerm) && (
                                <button
                                    className="mt-4 w-full border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-colors"
                                    onClick={clearFilters}
                                >
                                    Xóa bộ lọc
                                </button>
                            )} */}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.map((product: MODELS.IPerfume) => (
                                <>
                                    <ProductCard key={product._id} product={product} />
                                    {console.log(product)}
                                </>
                            ))}
                        </div>
                        {product.length === 0 && (
                            <p className="text-center text-[#5a483e] mt-8">Không tìm thấy sản phẩm phù hợp.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#2a1f1a] text-[#e8d5c4] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-serif mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="#" className="hover:text-white transition-colors">
                                        Tất cả sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:text-white transition-colors">
                                        Về chúng tôi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:text-white transition-colors">
                                        Liên hệ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:text-white transition-colors">
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

export default CategoryPage