import {state} from "./state.js"
import { clearAuthState , refreshToken} from "./auth.js"
import { updateNavbar } from "./views/components/navbar.js"


let axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true
})


axiosInstance.interceptors.request.use(
    function(config) {
        if(state.token != null)
            config.headers.Authorization = "Bearer " + state.token
        
        return config
    }
)
axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        let request = error.config

        if (request?.skipAuthRefresh || request?.url == "/auth/refresh") {
            return Promise.reject(error)
        }

        if (!request._retry && error.response?.status == 401) {
            request._retry = true

            try {
                let data = await refreshToken()
                state.token = data.token
                state.user = data.user

                request.headers.Authorization = "Bearer " + state.token
                updateNavbar(data.user)
                return axiosInstance(request)
            } catch (err) {
                clearAuthState()
                return Promise.reject(err)
            }
            
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
