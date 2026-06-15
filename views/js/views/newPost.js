// post-modal.js

import axiosInstance from "../api.js";
import { state } from "../state.js";
import {renderPost} from "./feed.js"


export async function renderNewPostModal() {
  try {
    console.log(state)
    
    let user = state.user
    document.getElementById('body').innerHTML += `
      <button class="fab" id="fab">
        <i class="ti ti-plus"></i>
      </button>

      <div class="post-modal" id="postModal">
        <div class="post-modal__card">

          <div class="post-modal__header">
            <span class="post-modal__title">New Post</span>
            <button class="post-modal__close" id="modalClose">
              <i class="ti ti-x"></i>
            </button>
          </div>

          <div class="post-modal__body">
            <div class="post-modal__user">
              <img class="post-modal__avatar" src="avatars/${user.avatar}" id="modalAvatar">
              <span class="post-modal__username" id="modalUsername">${user.name}</span>
            </div>

            <textarea
              class="post-modal__textarea"
              id="postContent"
              placeholder="What's on your mind?"
            ></textarea>


            <div class="post-modal__previews" id="imagePreviews"></div>
          </div>

          <div class="post-modal__footer">
            <div class="post-modal__tools">
              <button class="post-modal__tool-btn post-modal__tool-btn--photo" title="Add image">
                <i class="ti ti-photo"></i>
              </button>
              <button class="post-modal__tool-btn" title="Add emoji">
                <i class="ti ti-mood-smile"></i>
              </button>
            </div>

            <input type="file" id="imageInput" accept="image/*" multiple style="display:none" />
            <button class="post-modal__submit" id="submitPost" disabled>Post</button>
          </div>

        </div>
      </div>
    `;

    initPostModal();
  } catch (error) {
    console.log(error)
  }
  
}


export function initPostModal() {
  // ── Elements ──────────────────────────────────────

  const fab         = document.getElementById('fab');
  const modal       = document.getElementById('postModal');
  const closeBtn    = document.getElementById('modalClose');
  const textarea    = document.getElementById('postContent');
  const submitBtn   = document.getElementById('submitPost');
  const imageInput  = document.getElementById('imageInput');
  const photoBtn    = modal.querySelector('.post-modal__tool-btn--photo');
  const previewsEl  = document.getElementById('imagePreviews');


  let selectedFiles = [];


  const abortCtrl = new AbortController();

  // ── Event Listeners ───────────────────────────────
  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);


  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('post-modal--open')) {
      closeModal();
    }
  }, { signal: abortCtrl.signal });

  textarea.addEventListener('input', updateSubmitBtn);

  photoBtn.addEventListener('click', () => imageInput.click());


  imageInput.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    selectedFiles  = [...selectedFiles, ...newFiles].slice(0, 4); // max 4
    renderPreviews();
    updateSubmitBtn();
    imageInput.value = ''; 
  });


  previewsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.post-modal__remove-img');
    if (!btn) return;
    selectedFiles.splice(Number(btn.dataset.index), 1);
    renderPreviews();
    updateSubmitBtn();
  });

  submitBtn.addEventListener('click', submitPost);

  // ── Functions ─────────────────────────────────────

  function openModal() {
    modal.classList.add('post-modal--open');
    textarea.focus();
  }

  function closeModal() {
    modal.classList.remove('post-modal--open');
    textarea.value       = '';
    selectedFiles        = [];
    previewsEl.innerHTML = '';
    previewsEl.className = 'post-modal__previews';
    updateSubmitBtn();
  }


  function updateSubmitBtn() {
    const hasText   = textarea.value.trim().length > 0;
    const hasImages = selectedFiles.length > 0;
    submitBtn.disabled = !hasText && !hasImages;
  }


  function renderPreviews() {
    if (selectedFiles.length === 0) {
      previewsEl.innerHTML = '';
      previewsEl.className = 'post-modal__previews';
      return;
    }

    const cols = selectedFiles.length === 1 ? 'cols-1' : 'cols-2';
    previewsEl.className = `post-modal__previews ${cols}`;

    previewsEl.innerHTML = selectedFiles.map((file, i) => `
      <div class="post-modal__preview-item">
        <img src="${URL.createObjectURL(file)}" alt="preview ${i + 1}" />
        <button class="post-modal__remove-img" data-index="${i}" aria-label="Remove image">
          <i class="ti ti-x"></i>
        </button>
      </div>
    `).join('');
  }

  async function submitPost() {
    const text = textarea.value.trim();
    if (!text && selectedFiles.length === 0) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Posting...';

    const formData = new FormData();
    formData.append('content', text);
    selectedFiles.forEach(file => formData.append('image', file));

    try {
      const res = await axiosInstance.post('/posts/add', formData);
      document.getElementById('feed').insertAdjacentHTML('afterbegin', await renderPost(res.data));
      closeModal();
    } catch (err) {
      console.error('Failed to post:', err);
      submitBtn.textContent = 'Post';
      updateSubmitBtn();
    }
  }
}