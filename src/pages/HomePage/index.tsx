import { ROUTES } from "@constants/route"
import brandService from "@services/brand"
import perfumeService from "@services/perfumes"
import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { Droplets } from "lucide-react"


const HomePage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    //#region Search
    const [search, setSearch] = useState("")
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }
    //#endregion

    //#region Brands
    const [brands, setBrands] = useState<MODELS.IBrand[]>([])
    const [selectedBrand, setSelectedBrand] = useState<string | "">("")

    useEffect(() => {
        brandService
            .findAllBrand()
            .then((res) => {
                setBrands(res.data.data.data)
            })
            .catch((err) => console.log(err))
    }, [])

    const handleBrandSelect = (brandId: string) => {
        if (selectedBrand === brandId) {
            setSelectedBrand("")
        } else {
            setSelectedBrand(brandId)
        }
    }
    //#endregion

    //#region Fetch data
    const [perfumes, setPerfumes] = useState<MODELS.IPerfume[]>([]) // Use MODELS.IPerfume[]
    const fetchPerfumes = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await perfumeService.findPerfumeByName(search, selectedBrand)

            setPerfumes(res.data?.data?.data || [])
        } catch (err) {
            setError("Không thể tải dữ liệu nước hoa")
        } finally {
            setLoading(false)
        }
    }, [search, selectedBrand])
    //#endregion

    useEffect(() => {
        let isMounted = true
        fetchPerfumes()
        return () => {
            isMounted = false
        }
    }, [fetchPerfumes])

    return (
        <div className="min-h-screen bg-[#fffcf8]">
            {/* Search */}
            <div className="container mx-auto px-4 pt-8">
                <input
                    type="text"
                    className="w-full p-3 mb-6 border border-[#d9c7b8] rounded-md bg-white placeholder-[#a67c52]/70 focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                    placeholder="Tìm kiếm nước hoa..."
                    value={search}
                    onChange={handleSearch}
                />

                {/* Brand Selection */}
                <div className="mb-8">
                    <h3 className="text-xl font-serif text-[#3a2a21] mb-4">Thương hiệu</h3>
                    <div className="flex flex-wrap gap-2">
                        {brands?.map((brand) => (
                            <button
                                key={brand._id}
                                onClick={() => brand._id && handleBrandSelect(brand._id)}
                                className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${selectedBrand === brand._id
                                    ? "bg-[#a67c52] text-white"
                                    : "bg-[#f8f3e9] text-[#a67c52] border border-[#a67c52] hover:bg-[#a67c52]/10"
                                    }`}
                            >
                                {brand.brandName}
                            </button>
                        ))}
                        {selectedBrand && (
                            <button
                                onClick={() => setSelectedBrand("")}
                                className="px-4 py-2 rounded-md bg-[#f8f3e9] text-[#a67c52] border border-[#a67c52] hover:bg-[#a67c52]/10"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center text-[#3a2a21] mb-12">
                        {selectedBrand
                            ? `Nước hoa ${brands?.find((b) => b._id === selectedBrand)?.brandName || ""}`
                            : "Sản phẩm nổi bật"}
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-[#a67c52] border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-[#a67c52]">Đang tải...</p>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500 py-12">{error}</p>
                    ) : perfumes.length === 0 ? (
                        <p className="text-center text-[#a67c52] py-12">Không tìm thấy sản phẩm nào</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {perfumes.map((item) => (
                                <Link
                                    to={item._id ? ROUTES.PUBLIC.DETAILPRODUCT.replace(":id", item._id) : "#"}
                                    key={item._id}
                                    className="bg-[#f8f3e9] rounded-lg p-6 shadow-md transition-transform hover:scale-105 relative overflow-hidden group"
                                >
                                    {/* Concentration Badge */}
                                    {item.concentration === "Extrait" && (
                                        <div
                                            className={`absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg border bg-gradient-to-r from-amber-500 to-amber-700 border-amber-600 transform transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>{item.concentration}</span>
                                                <div className="flex ml-1">
                                                    {item.concentration === "Extrait" &&
                                                        <Droplets size={12} className="fill-white text-white" />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative h-64 mb-4 flex justify-center z-1">
                                        <img
                                            src={item.uri || "/placeholder.svg"}
                                            alt={`Nước hoa ${item.perfumeName}`}
                                            className="rounded-md w-64 object-cover"
                                        />

                                        {/* Premium Badge for Extrait */}
                                        {item.concentration === "Extrait" && (
                                            <div className="absolute -top-3 -left-3 bg-amber-500 text-white text-xs font-bold py-1 px-2 rounded-br-lg shadow-md transform -rotate-12">
                                                PREMIUM
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-serif text-[#3a2a21] mb-2 relative z-10">{item.perfumeName}</h3>

                                    <p className="text-[#5a483e] mb-4 relative z-10 line-clamp-2">{item.description}</p>

                                    <div className="flex justify-between items-center relative z-10">
                                        <span className="text-[#a67c52] font-semibold">${item.price.toLocaleString("vi-VN")}</span>
                                        <button className="border border-[#a67c52] text-[#a67c52] px-4 py-2 rounded-md hover:bg-[#a67c52] hover:text-white transition-colors">
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Concentration Guide Section */}
            <section className="py-12 bg-[#f8f3e9]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center text-[#3a2a21] mb-8">Hướng dẫn nồng độ nước hoa</h2>
                    <p className="text-center text-[#5a483e] mb-10 max-w-3xl mx-auto">
                        Nồng độ nước hoa quyết định độ lưu hương và cường độ mùi. Từ Eau Fraiche đến Extrait, mỗi loại có đặc điểm
                        riêng.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-serif text-[#3a2a21] mb-3 flex items-center">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getConcentrationColor("Extrait")}`}></span>
                                Extrait (Pure Perfume)
                            </h3>
                            <p className="text-[#5a483e]">
                                Nồng độ cao nhất (20-40%), lưu hương 8-12 giờ. Đây là loại nước hoa cao cấp nhất, mang lại trải nghiệm
                                hương thơm sâu sắc và lâu dài.
                            </p>
                        </div> */}

                        {/* <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-serif text-[#3a2a21] mb-3 flex items-center">
                                <span
                                    className={`inline-block w-3 h-3 rounded-full mr-2 ${getConcentrationColor("Eau de Parfum")}`}
                                ></span>
                                Eau de Parfum (EDP)
                            </h3>
                            <p className="text-[#5a483e]">
                                Nồng độ 15-20%, lưu hương 5-8 giờ. Phổ biến và cân bằng giữa độ lưu hương và giá cả, phù hợp cho sử dụng
                                hàng ngày.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-serif text-[#3a2a21] mb-3 flex items-center">
                                <span
                                    className={`inline-block w-3 h-3 rounded-full mr-2 ${getConcentrationColor("Eau de Toilette")}`}
                                ></span>
                                Eau de Toilette (EDT)
                            </h3>
                            <p className="text-[#5a483e]">
                                Nồng độ 5-15%, lưu hương 3-5 giờ. Nhẹ nhàng và tươi mát, thích hợp cho thời tiết ấm áp và sử dụng hàng
                                ngày.
                            </p>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage

