import axiosInstance from "../api.js";
import { navigate } from "../router.js";
import { state } from "../state.js";
import { generatePosts } from "./feed.js"

let postsPage = 1

export async function renderProfile() {
    const params = new URLSearchParams(window.location.search);

    const userId   = (params.get('userId') == null) ? state.user.user_id : params.get('userId');
    try {
        let res = await axiosInstance.get(`users/profile/${userId}`)
        document.getElementById("body").innerHTML = "<div id='profile'></div>"
        renderProfileCard(res.data.user)
        renderUserPosts(userId)
    } catch (err) {
        console.log(err)
        navigate("/")
    }
    
}

function renderProfileCard(user) {
    document.getElementById("profile").innerHTML = `
    <div class="profile-card">

        <div class="profile-card__header">
            <img class="profile-card__avatar" src="avatars/${user.avatar}">
            <div>
                <p class="profile-card__name">${user.name}</p>
                <p class="profile-card__email">
                    <i class="ti ti-mail"></i>${user.email}
                </p>
            </div>
        </div>

        <div class="profile-card__stats">
            <div class="profile-card__stat">
                <p class="profile-card__stat-value">${user.postsCount}</p>
                <p class="profile-card__stat-label">Posts</p>
            </div>
            <div class="profile-card__stat">
                <p class="profile-card__stat-value">${user.commentsCount}</p>
                <p class="profile-card__stat-label">Comments</p>
            </div>
            <div class="profile-card__stat">
                <p class="profile-card__stat-value">${user.likesCount}</p>
                <p class="profile-card__stat-label">Likes</p>
            </div>
        </div>

    </div>
    `
}

async function getPosts(userId) {
    try {
        let res = await axiosInstance.get(`/posts?owner=${userId}&page=${postsPage}`)
        return res.data.posts
    } catch (error) {
        console.log(error)
        return []
    }
}

async function loadPosts(userId) {
    document.getElementById("feed").innerHTML += await generatePosts(await getPosts(userId))
    postsPage++
}

async function renderUserPosts(userId) {
    try {
        let res = await axiosInstance.get(`/posts?owner=${userId}&page=${postsPage}`)
        document.getElementById("profile").innerHTML += '<div><div id="feed"></div><div id="sentinel"></div></div>'
        if (res.data.posts.length != 0) {
            let observer = new IntersectionObserver(async(entries) => {
                if (!entries[0].isIntersecting) return
                await loadPosts(userId)
            }, {
                root: null,
                threshold: 0.1
            })
            observer.observe(document.getElementById("sentinel"))
            document.getElementById("feed").innerHTML += await generatePosts(res.data.posts)

        } else {
            document.getElementById("feed").innerHTML += "<p>no posts</p>"
        }
    } catch (error) {
        console.log(error)
    }
}