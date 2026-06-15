

let postLiked = false;

function togglePostLike() {
    postLiked = !postLiked;
    const btn = document.getElementById('postLikeBtn');
    const icon = document.getElementById('postLikeIcon');
    btn.classList.toggle('post-card__action-btn--liked', postLiked);
    icon.className = postLiked ? 'ti ti-heart-filled' : 'ti ti-heart';
}

function togglePostComments() {
    const section = document.getElementById('postComments');
    section.classList.toggle('post-card__comments--open');
}




