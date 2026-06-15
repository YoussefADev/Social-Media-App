import { logout } from "../../auth.js";
window.logout = logout
export async function updateNavbar(user = null) {
    let actions = document.querySelector(".nav-actions")

    if(user != null) {
        actions.innerHTML = `
            <div class="nav-user">
                <img src="avatars/${user.avatar}" alt="${user.name}"
            />
            <span>${user.name}</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
        </div>
        `;
    } else {
        actions.innerHTML = `
            <button class="btn-signup" href="/sign-up" data-link>Sign up</button>
            <button class="btn-login" href="/login" data-link>Log in</button>
        `;
    }
}