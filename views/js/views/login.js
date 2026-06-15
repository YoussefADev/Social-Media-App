
import { navigate } from "../router.js"
import { state } from "../state.js"
import { login } from "./../auth.js"
window.login = login
export function renderLoginForm() {
    if (state.token != null) {
        navigate("/")
        return
    }
    document.getElementById("body").innerHTML = `
        <div class="card">
            <h1>Welcome back</h1>
            <p class="subtitle">Sign in to your account to continue</p>
        
            <div class="field">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="you@example.com" />
            </div>
        
            <div class="field">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" />
                <a href="#" class="forgot">Forgot password?</a>
            </div>
        
            <button class="btn" onclick="login()">Log in</button>
        
            <div class="divider"><span>or</span></div>
        
            <p class="footer">Don't have an account? <a href="/sign-up" data-link>Sign up</a></p>
        </div>
    `
}
