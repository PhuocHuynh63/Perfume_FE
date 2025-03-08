import { axiosClient } from "@configs/axios"

const authService = {
    async login(data: MODELS.IUser) {
        return axiosClient.post("/member/login", data)
    },
    async register(data: MODELS.IUser) {
        return axiosClient.post("/member/register", data)
    },
}

export default authService