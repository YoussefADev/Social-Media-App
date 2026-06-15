import {state} from "./state.js"
import { renderLoginForm } from "./views/login.js"
import { renderSignupForm } from "./views/sign-up.js"
import { renderFeed } from "./views/feed.js"
import { render404Page } from "./views/notFound.js"
import { renderNewPostModal } from "./views/newPost.js"
import { renderProfile } from "./views/profile.js"


const routes = {
    "/" : { render: renderFeed},
    "/profile": {render: renderProfile},
    "/login": {render: renderLoginForm},
    "/sign-up": {render: renderSignupForm},
    "/new-post": {render: renderNewPostModal},
    "/404": {render: render404Page}
}

export function router() {
    let path = window.location.pathname

    let route = routes[path] || routes["/404"]
    route.render()

}

export function navigate(path) {
    history.pushState({}, "", path)
    router()
}

document.addEventListener("click", (e) => {
    let link = e.target.closest("[data-link]")
    if (link) {

        e.preventDefault();

        navigate(link.pathname + link.search);
    }
});

window.addEventListener("popstate", router);
