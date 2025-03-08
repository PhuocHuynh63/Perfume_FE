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
}

export default perfumeService