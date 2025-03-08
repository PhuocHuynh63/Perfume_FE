import { axiosPrivate } from "@configs/axios"

const perfumeService = {
    async findAllPerfumes(page?: number, limit?: number) {
        return await axiosPrivate.get(`/perfume?page=${page}&limit=${limit}`)
    },
    async findPerfumeById(id: string) {
        return await axiosPrivate.get(`/perfume/id/${id}`)
    },
    async findPerfumeByName(name: string = '', brandId: string = '', current: number = 1, pageSize: number = 10) {
        return await axiosPrivate.get(`/perfume/search?name=${name}&brandId=${brandId}&current=${current}&pageSize=${pageSize}`)
    },
    async createPerfume(data: any) {
        return await axiosPrivate.post(`/perfume/create`, data)
    },
    async updatePerfume(perfumeId: string, data: any) {
        return await axiosPrivate.put(`/perfume/update/${perfumeId}`, data)
    },
    async addCommentIntoPerfume(perfumeId: string, data: any) {
        return await axiosPrivate.post(`/perfume/${perfumeId}/comment/create`, data)
    },
    async deletePerfume(perfumeId: string) {
        return await axiosPrivate.delete(`/perfume/delete/${perfumeId}`)
    }
}

export default perfumeService