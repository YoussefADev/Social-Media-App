
import { navigate } from "../router.js"
import { state } from "../state.js"
import { signup } from "./../auth.js"
window.signup = signup
export function renderSignupForm() {
    if (state.token != null) {
        navigate("/")
        return
    }
    document.getElementById("body").innerHTML = `
        <div class="card">
            <h1>Get started</h1>
            <p class="subtitle">Join thousands of users today</p>
        
            <div class="field">
                <label for="name">Full name</label>
                <input type="text" id="name" placeholder="John Doe" />
            </div>
        
            <div class="field">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="you@example.com" />
            </div>
        
            <div class="field">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" />
            </div>
        
            <button class="btn" onclick="signup()">Create account</button>
        
            <div class="divider"><span>or</span></div>
        
            <p class="footer">Already have an account? <a href="/login" data-link>Log in</a></p>
        </div>
    `
}

