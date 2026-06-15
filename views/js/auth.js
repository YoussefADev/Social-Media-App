import { state } from "./state.js"
import axiosInstance from "./api.js"
import {updateNavbar} from "./views/components/navbar.js"
import { navigate } from "./router.js"


export async function login() {
    try {
        let email = document.getElementById("email").value 
        let password = document.getElementById("password").value

        let res = await axiosInstance.post("/auth/login", {
            email: email,
            password: password
        }, {
            withCredentials: true
        })
        console.log(res)

        switch (res.status) {
            case 200:
                state.token = res.data.token
                state.user = res.data.user
                updateNavbar(res.data.user)
                navigate("/")
                break;
            case 400:
                alert("password is wrong")
                break;
            case 404: 
                alert("there is no account with this email")
            default:
                alert("server is down, try again after sometime")
                break;
        }
    } catch (error) {
        
        console.log(error)
    }
}

export async function signup() {
    try {
        let name = document.getElementById("name").value
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value

        let res = await axiosInstance.post("/auth/sign-up", {
            name: name,
            email: email,
            password: password
        }, {
            withCredentials: true
        })
        console.log(res)
        if (res.status == 201) {
            alert("account created successfully")
            navigate("/login")
        }
        
    } catch (error) {
        if (!error.response) {
            alert("Network error")
            return
        }
        switch (error.response.status) {
            case 400:
                alert(error.response.data.errors[0])
                break;
            case 409:
                alert("email already exists")
                break
            default:
                alert("internal server error")
                break;
        }
    }
}

export async function logout() {
    try {
        let res = await axiosInstance.post("/auth/logout", {}, {
            withCredentials: true,
            skipAuthRefresh: true
        })
        clearAuthState()
    } catch (error) {
        console.log(error)
        clearAuthState()
    }
}

export function clearAuthState() {
    state.token = null
    state.user = {
        user_id: null,
        name: null,
        avatar: null
    }
    updateNavbar()
    navigate("/login")
}

export async function refreshToken() {
    try {
        let res = await axios.get("/api/auth/refresh", {
            withCredentials: true,
            skipAuthRefresh: true
        })
        if (res.status == 200) {
            return res.data
        }
    } catch (error) {
        throw error
    }
}
