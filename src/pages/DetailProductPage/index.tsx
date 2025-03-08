import perfumeService from '@services/perfumes'
import { Star, Minus, Plus, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailProductPage = () => {
    const { id } = useParams<{ id: string }>()

    const [quantity, setQuantity] = useState(1)

    const increaseQuantity = () => setQuantity(prev => prev + 1)
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

    const [product, setProduct] = useState({
        _id: "",
        perfumeName: "",
        uri: "",
        price: 0,
        concentration: "",
        description: "",
        ingredients: "",
        volume: 0,
        targetAudience: "",
        comments: [],
        brand: null,
    })
    useEffect(() => {
        perfumeService.findPerfumeById(id as string)
            .then(res => {
                setProduct(res.data.data)
                console.log(res.data.data);
            })
            .catch(err => console.log(err))
    }, [id])

    window.scrollTo(0, 0)

    return (
        <div className="min-h-screen bg-[#fffcf8]">
            {/* Product Detail Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Image */}
                        <div className="md:w-1/2">
                            <img
                                src={product.uri}
                                alt={product.perfumeName}
                                width={600}
                                height={600}
                                className="rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 space-y-6">
                            <h1 className="text-3xl font-serif text-[#3a2a21]">{product.perfumeName}</h1>
                            <div className="flex items-center space-x-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.floor(4)
                                                ? 'text-[#a67c52] fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[#5a483e]">{product.rating} {product.comments.length} đánh giá</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#a67c52]">
                                ${product.price}
                            </p>
                            <p className="text-[#5a483e]">{product.description}</p>

                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#5a483e]">Quantity:</span>
                                <div className="flex items-center border border-[#d9bfa9] rounded-md">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="px-3 py-1 text-[#a67c52] hover:bg-[#f8f3e9] transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1 text-[#3a2a21]">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="px-3 py-1 text-[#a67c52] hover:bg-[#f8f3e9] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart and Wishlist Buttons */}
                            <div className="flex space-x-4">
                                <button className="flex-1 bg-[#a67c52] hover:bg-[#8a5a2b] text-white transition-colors">
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="border-[#a67c52] text-[#a67c52] hover:bg-[#f8f3e9] transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-[#e8d5c4] pt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#3a2a21]">Volume:</h3>
                                    <p className="text-[#5a483e]">{product.volume}ml</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#3a2a21]">Target Audience:</h3>
                                    <p className="text-[#5a483e]">{product.targetAudience}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#3a2a21]">Ingredients:</h3>
                                    <p className="text-[#5a483e]">{product.ingredients}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Reviews Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center text-[#3a2a21] mb-12">Đánh giá từ khách hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {product.comments.map((review: MODELS.IComment) => (
                            <div key={review._id} className="bg-[#f8f3e9] p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-5 h-5 text-[#a67c52] fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-[#5a483e]">{review.rating}</span>
                                </div>
                                <p className="text-[#5a483e] mb-4">
                                    {review.content}
                                </p>
                                <p className="text-[#3a2a21] font-semibold">Minh Anh</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center text-[#3a2a21] mb-12">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-lg p-6 shadow-md transition-transform hover:scale-105">
                                <div className="relative h-64 mb-4">
                                    <img
                                        src={`/placeholder.svg?height=300&width=300&text=Nước hoa ${item}`}
                                        alt={`Nước hoa ${item}`}
                                        className="rounded-md"
                                    />
                                </div>
                                <h3 className="text-xl font-serif text-[#3a2a21] mb-2">Hương thơm quyến rũ {item}</h3>
                                <p className="text-[#5a483e] mb-4">Sự kết hợp tinh tế của hương hoa và gỗ.</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#a67c52] font-semibold">1.999.000 ₫</span>
                                    <button className="border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-colors">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    )
}

export default DetailProductPage