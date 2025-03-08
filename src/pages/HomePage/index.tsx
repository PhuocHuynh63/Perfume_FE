import { ROUTES } from "@constants/route"
import brandService from "@services/brand"
import perfumeService from "@services/perfumes"
import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"

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
    const [selectedBrand, setSelectedBrand] = useState<string | ''>('')

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
            setSelectedBrand('')
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
                                onClick={() => setSelectedBrand('')}
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
                                    className="bg-[#f8f3e9] rounded-lg p-6 shadow-md transition-transform hover:scale-105"
                                >
                                    <div className="relative h-64 mb-4 flex justify-center">
                                        <img
                                            src={item.uri || "/placeholder.svg"}
                                            alt={`Nước hoa ${item.perfumeName}`}
                                            className="rounded-md w-64 object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-serif text-[#3a2a21] mb-2">{item.perfumeName}</h3>
                                    <p className="text-[#5a483e] mb-4">Sự kết hợp tinh tế của hương hoa và gỗ.</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#a67c52] font-semibold">2.999.000 ₫</span>
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
        </div>
    )
}

export default HomePage

