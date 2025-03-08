import { ROUTES } from "@constants/route"
import { CookiesService } from "@helpers/cookies"
import perfumeService from "@services/perfumes"
import { jwtDecode } from "jwt-decode"
import { Star, Minus, Plus, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"


const DetailProductPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()


    const [quantity, setQuantity] = useState(1)

    const increaseQuantity = () => setQuantity((prev) => prev + 1)
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

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
        comments: [] as MODELS.IComment[],
        brand: null,
    })

    // State cho form comment mới
    const [newComment, setNewComment] = useState({
        rating: 3,
        content: "",
    })
    const [submitting, setSubmitting] = useState(false)


    const token = CookiesService.get();
    const currentUserId = token ? jwtDecode<GLOBAL.IJWTPayload>(token)._id : null;

    useEffect(() => {
        perfumeService
            .findPerfumeById(id as string)
            .then((res) => {
                setProduct(res.data.data)
                console.log(res.data);


            })
            .catch((err) => {
                console.log(err)
                if (err.response?.status === 404) {
                    navigate(ROUTES.PUBLIC.HOME)
                }
            })
    }, [id, newComment])

    // Xử lý thay đổi rating
    const handleRatingChange = (rating: number) => {
        setNewComment((prev) => ({ ...prev, rating }))
    }

    // Xử lý thay đổi nội dung comment
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment((prev) => ({ ...prev, content: e.target.value }))
    }

    // Xử lý submit comment
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.content.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá")
            return
        }

        setSubmitting(true)

        try {
            const commentData = {
                rating: newComment.rating,
                content: newComment.content,
                author: currentUserId,
            }

            const response = await perfumeService.addCommentIntoPerfume(id as string, commentData)

            // Cập nhật danh sách comments
            setProduct((prev) => ({
                ...prev,
                comments: [...prev.comments, response.data.data],
            }))

            // Reset form
            setNewComment({
                rating: 3,
                content: "",
            })

            toast.success(response.data.message)
        } catch (error) {
            console.error("Error submitting comment:", error)
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fffcf8]">
            {/* Product Detail Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Image */}
                        <div className="md:w-1/2">
                            <img
                                src={product.uri || "/placeholder.svg"}
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
                                    {[1, 2, 3].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.floor(2) ? "text-[#a67c52] fill-current" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[#5a483e]">{product.comments.length} đánh giá</span>
                            </div>
                            <p className="text-2xl font-semibold text-[#a67c52]">${product.price}</p>
                            <p className="text-[#5a483e]">{product.description}</p>

                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#5a483e]">Quantity:</span>
                                <div className="flex items-center border border-[#d9bfa9] rounded-md">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="px-3 py-1 text-[#a67c52] hover:bg-[#f8f3e9] transition-colors"
                                        title="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1 text-[#3a2a21]">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="px-3 py-1 text-[#a67c52] hover:bg-[#f8f3e9] transition-colors"
                                        title="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart and Wishlist Buttons */}
                            <div className="flex space-x-4">
                                <button className="flex-1 bg-[#a67c52] hover:bg-[#8a5a2b] text-white py-2 px-4 rounded-md transition-colors">
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="border border-[#a67c52] text-[#a67c52] hover:bg-[#f8f3e9] p-2 rounded-md transition-colors" title="Add to wishlist">
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

                    {/* Add Comment Form */}
                    <div className="max-w-2xl mx-auto mb-12 bg-[#f8f3e9] p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-serif text-[#3a2a21] mb-4">Viết đánh giá của bạn</h3>
                        <form onSubmit={handleSubmitComment}>
                            <div className="mb-4">
                                <label className="block text-[#5a483e] mb-2">Đánh giá của bạn</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            className="focus:outline-none"
                                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= newComment.rating ? "text-[#a67c52] fill-current" : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-[#5a483e] mb-2">
                                    Nội dung đánh giá
                                </label>
                                <textarea
                                    id="comment"
                                    rows={4}
                                    value={newComment.content}
                                    onChange={handleContentChange}
                                    placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
                                    className="w-full p-3 border border-[#d9c7b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#a67c52] hover:bg-[#8a5a2b] text-white py-2 px-6 rounded-md transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    {product.comments.length === 0 ? (
                        <div className="text-center text-[#5a483e] py-8">
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                            <p className="mt-2">Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {product.comments.map((review) => (
                                <div key={review._id} className="bg-[#f8f3e9] p-6 rounded-lg shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="flex">
                                            {[1, 2, 3].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= review.rating ? "text-[#a67c52] fill-current" : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-[#5a483e]">{review?.rating} sao</span>
                                    </div>
                                    <p className="text-[#5a483e] mb-4">{review?.content}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[#3a2a21] font-semibold">Người dùng {review?.author?.name}</p>
                                        <p className="text-sm text-[#5a483e]">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                    <button className="border border-[#a67c52] text-[#a67c52] px-4 py-2 rounded-md hover:bg-[#a67c52] hover:text-white transition-colors">
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

