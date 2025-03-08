import { COOKIES } from "@constants/common";
import Cookies from "js-cookie"

export const CookiesService = {
    get: () => {
        return Cookies.get(COOKIES.ACCESS_TOKEN);
    },
    set: (userInfo: any) => {
        Cookies.set(COOKIES.ACCESS_TOKEN, userInfo, { expires: 1 });
    },
    remove: () => {
        Cookies.remove(COOKIES.ACCESS_TOKEN);
    }
}
