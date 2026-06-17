

import axiosInstance from "../api.js"
import { state } from "../state.js"
import { navigate } from "../router.js"

import { renderNewPostModal } from "./newPost.js"
let postsPage = 1
let activeMenu;


async function loadPosts() {
    document.getElementById("feed").innerHTML += await generatePosts(await getPosts())
    postsPage++
}
export async function renderFeed() {

    try {
        document.getElementById("body").innerHTML = `<div><div id="feed"></div> <div id="sentinel"></div></div>`
        await loadPosts()
        let observer = new IntersectionObserver(async(entries) => {
            if (!entries[0].isIntersecting) return
            await loadPosts()
            
        }, {
            root: null,
            threshold: 0.1
        })
        observer.observe(document.getElementById("sentinel"))
        renderNewPostModal()
        document.getElementById('feed').addEventListener('click', (e) => {

            // ── Like ──
            const likeBtn = e.target.closest('.post-card__like-btn');
            if (likeBtn) {
                const postId  = likeBtn.closest('.post-card').dataset.postId;
                const isLiked = likeBtn.dataset.liked === 'true';
                const icon    = likeBtn.querySelector('i');

                likeBtn.dataset.liked = !isLiked;
                likeBtn.classList.toggle('post-card__action-btn--liked', !isLiked);
                icon.className = !isLiked ? 'ti ti-heart-filled' : 'ti ti-heart';

                axiosInstance.post(`posts/${postId}/like`, { liked: !isLiked });
                return;
            }

            // ── Toggle Comments ──
            const commentBtn = e.target.closest('.post-card__comment-btn');
            if (commentBtn) {
                const postId   = commentBtn.closest('.post-card').dataset.postId;
                const comments = document.getElementById(`comments-${postId}`);
                comments.classList.toggle('post-card__comments--open');
                return;
            }

            // ── Send Comment ──
            const sendBtn = e.target.closest('.post-card__send-btn');
            if (sendBtn) {
                const card   = sendBtn.closest('.post-card');
                const input = card.querySelector('.post-card__comment-input');
                if (input) {
                    const postId = card.dataset.postId;
                    sendPostComment(postId, card, input);
                    return
                }
            }

            // ── Share ──
            const shareBtn = e.target.closest('.post-card__share-btn');
            if (shareBtn) {
                const postId = shareBtn.closest('.post-card').dataset.postId;
                navigator.share?.({ url: `/posts/${postId}` });
                return;
            }

            const menuBtn = e.target.closest('.post-card__menu-btn');
            if (menuBtn) {
                e.stopPropagation();
                const card = menuBtn.closest('.post-card');
                toggleMenu(menuBtn, card);
                return;
            }


            const menuItem = e.target.closest('.post-menu__item');
            if (menuItem) {
                e.stopPropagation();
                const action = menuItem.dataset.action;
                const card   = menuItem.closest('.post-card');
                handleAction(action, card);
                closeActiveMenu();
                return;
            }

        });
        document.addEventListener('click', () => closeActiveMenu());
        document.getElementById('feed').addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            const input = e.target.closest('.post-card__comment-input');
            if (input) {
                const card   = input.closest('.post-card');
                const postId = card.dataset.postId;
                sendPostComment(postId, card, input);
            }
        });

    } catch (err) {
        console.log(err)
    }
    
}

async function sendPostComment(postId, card, input) {
    const text = input.value.trim();
    if (!text) return;
    try {
        let res = await axiosInstance.post("/comments/add", {
            post_id: postId,
            content: text
        })

        const section = card.querySelector(`#comments-${postId}`);
        const inputRow = section.querySelector('.post-card__input-row');

        const comment = document.createElement('div');
        comment.className = 'post-card__comment';
        comment.innerHTML = `
            <img class="post-card__comment-avatar" src="avatars/${state.user.avatar}">
            <div class="post-card__comment-bubble">
                <p class="post-card__comment-author">${state.user.name}</p>
                <p class="post-card__comment-text">${text}</p>
                <div class="post-card__comment-actions">
                    <span>Just now</span>
                </div>
            </div>
        `;

        section.insertBefore(comment, inputRow);
        input.value = '';
    } catch (err) {
        console.log(err)
        alert("adding comment failed")
    }
}

export async function renderPost(post) {
    let user = state.user
    let comments = (await axiosInstance.get(`comments/post/${post.id}`)).data
    return `
        <div class="post-card" data-post-id="${post.id}" data-owner-id="${post.user_id}">
            <!-- Header -->
            <div class="post-card__header">
                <div class="post-card__user-info">
                    <img class="post-card__avatar"src="avatars/${post.avatar}"></img>
                    <div>
                        <p class="post-card__username">${post.name}</p>
                        <p class="post-card__timestamp">
                        <i class="ti ti-clock"></i> ${post.timeFromNow}
                        </p>
                    </div>
                </div>
                <button class="post-card__menu-btn">
                    <i class="ti ti-dots"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="post-card__content">
                <p class="post-card__text">
                    ${post.content}
                </p>
            </div>

            <!-- Image -->
            <div class="post-card__image">
                <img src="posts/${post.image}" alt="post image" />
            </div>

            <!-- Reactions bar -->
            <div class="post-card__reactions-bar">
                <div class="post-card__reaction-emojis">
                    <span>❤️</span>
                    <span>👍</span>
                </div>
                <span class="post-card__comment-btn post-card__comments-count">${comments.length} comments</span>
            </div>

            <!-- Actions -->
            <div class="post-card__actions">
                <button class="post-card__like-btn post-card__action-btn ${post.isLikedByMe ? 'post-card__action-btn--liked' : ''}" id="postLikeBtn">
                    <i class="${post.isLikedByMe ? 'ti ti-heart-filled' : 'ti ti-heart'}" id="postLikeIcon"></i> Like
                </button>
                <button class="post-card__comment-btn post-card__action-btn">
                    <i class="ti ti-message-circle"></i> Comment
                </button>
                <button class="post-card__action-btn">
                    <i class="ti ti-share"></i> Share
                </button>
            </div>

            <!-- Comments -->
            <div class="post-card__comments" id="comments-${post.id}">
                ${generateComments(comments)}
                
                <!-- Input -->
                <div class="post-card__input-row">
                    <img src="avatars/${state.user.avatar}" class="post-card__comment-avatar">
                    <div class="post-card__input-wrap">
                        <input type="text" class="post-card__comment-input" placeholder="Write a comment..." />
                        <button class="post-card__send-btn">
                            <i class="ti ti-send"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

export async function generatePosts(posts) {
    let postsDiv = ""
    for(let post of posts) {
        postsDiv += await renderPost(post)
    }
    return postsDiv
}

function generateComments(comments) {
    let commentsDiv = ""
    for (let comment of comments) {
        commentsDiv += `
            <div class="post-card__comment" data-comment-id=${comment.id}>
                <img class="post-card__comment-avatar" src="avatars/${comment.avatar}"style="background:#E1F5EE; color:#085041;">
                <div class="post-card__comment-bubble">
                    <p class="post-card__comment-author">${comment.name}</p>
                    <p class="post-card__comment-text">${comment.content}</p>
                    <div class="post-card__comment-actions">
                        <span>${comment.timeFromNow}</span>
                    </div>
                </div>
            </div>
        `
    }
    return commentsDiv
}


async function getPosts() {
    try {
        let res = await axiosInstance.get(`/posts?page=${postsPage}&limit=10`)
        return res.data.posts
    } catch (error) {
        console.log(error)
        return []
    }
}

function toggleMenu(btn, card) {

    closeActiveMenu();

    const postId      = card.dataset.postId;
    const postOwnerId = card.dataset.ownerId; 
    const isOwner     = String(state.user.user_id) == String(postOwnerId);

    // ابنِ الـ dropdown
    const menu = document.createElement('div');
    menu.className = 'post-menu';
    menu.innerHTML = isOwner
      ? _ownerMenuHTML()
      : _visitorMenuHTML();
    card.style.position = 'relative';
    card.appendChild(menu);
    activeMenu = menu;

    // animation
    requestAnimationFrame(() => menu.classList.add('post-menu--open'));
}

function closeActiveMenu() {
    if (!activeMenu) return;
    activeMenu.remove();
    activeMenu = null;
}

async function handleAction(action, card) {
    const postId = card.dataset.postId;

    switch (action) {

      case 'delete': {
        if (!confirm('Delete this post?')) return;
        try {
          await axiosInstance.delete(`/posts/delete/${postId}`);
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.97)';
          setTimeout(() => card.remove(), 300);
        } catch (err) {
          console.error('Failed to delete post:', err);
        }
        break;
      }

      case 'view-profile': {
        const ownerId = card.dataset.ownerId;
        navigate(`/profile?userId=${ownerId}`);
        break;
      }

      case 'hide': {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.97)';
        setTimeout(() => card.remove(), 300);
        break;
      }

    }
}

  // ── HTML Templates ────────────────────────────────

  function _ownerMenuHTML() {
    return `
      <button class="post-menu__item post-menu__item--danger" data-action="delete">
        <i class="ti ti-trash"></i>
        Delete post
      </button>
    `;
  }

  function _visitorMenuHTML() {
    return `
      <button class="post-menu__item" data-action="view-profile">
        <i class="ti ti-user"></i>
        View profile
      </button>
      <div class="post-menu__divider"></div>
      <button class="post-menu__item post-menu__item--warning" data-action="hide">
        <i class="ti ti-eye-off"></i>
        Hide post
      </button>
    `;
  }


