import { axiosPrivate } from "@configs/axios"

const brandService = {
    async findAllBrand() {
        return await axiosPrivate.get("/brand")
    },
    async createBrand(data: MODELS.IBrand) {
        return await axiosPrivate.post("/brand/create", data)
    },
    async updateBrand(id: string, data: MODELS.IBrand) {
        return await axiosPrivate.put(`/brand/update/${id}`, data)
    },
    async deleteBrand(id: string) {
        return await axiosPrivate.delete(`/brand/delete/${id}`)
    }
}

export default brandService