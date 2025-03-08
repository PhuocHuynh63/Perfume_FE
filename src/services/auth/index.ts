import { axiosClient, axiosPrivate } from "@configs/axios"

const authService = {
    async login(data: MODELS.IUser) {
        return axiosClient.post("/member/login", data)
    },
    async register(data: MODELS.IUser) {
        return axiosClient.post("/member/register", data)
    },
    async getMemberById(id: string) {
        return await axiosPrivate.get(`/member/id/${id}`)
    },
    async getAllMember() {
        return await axiosPrivate.get(`/member/collectors`)
    },
    async updateMemberById(id: string, data: MODELS.IUser) {
        return await axiosPrivate.put(`/member/update/id/${id}`, data);
    },
    async changePassword(id: string, data: GLOBAL.IChangePassword) {
        return await axiosPrivate.patch(`/member/change-password/id/${id}`, data)
    }
}

export default authService