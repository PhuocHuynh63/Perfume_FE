import { axiosPrivate } from "@configs/axios"

const brandService = {
    async findAllBrand() {
        return await axiosPrivate.get("/brand")
    }
}

export default brandService