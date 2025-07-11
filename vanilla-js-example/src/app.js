import { setHTML, getValue, setValue, addEventListener } from './utils/dom.js';
import { setLiked, removeLiked, isLiked } from './utils/storage.js';
import { createModal } from './components/modal.js';
import { renderPost } from './components/post.js';
import { renderComment } from './components/comment.js';
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  addLike,
  removeLike,
  addComment,
} from './services/postService.js';

// アプリケーションの状態
let state = {
  currentPostId: null,
  commentModal: null,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

export function initApp() {
  setupModal();
  setupEventListeners();
  loadPosts(1);
}

function setupModal() {
  state.commentModal = createModal('#comment-modal');
}

function setupEventListeners() {
  // 新規投稿
  addEventListener('#submit-post', 'click', () => handleCreatePost());
  addEventListener('#new-post-content', 'keypress', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCreatePost();
    }
  });

  // 投稿アクション（動的に追加される要素）
  addEventListener(document, 'click', e => {
    if (e.target.closest('.like-btn')) {
      const postId = e.target.closest('.like-btn').dataset.postId;
      handleToggleLike(postId);
    } else if (e.target.closest('.comment-btn')) {
      const postId = e.target.closest('.comment-btn').dataset.postId;
      handleOpenComments(postId);
    } else if (e.target.closest('.delete-btn')) {
      const postId = e.target.closest('.delete-btn').dataset.postId;
      handleDeletePost(postId);
    } else if (e.target.closest('.pagination-button')) {
      const pageButton = e.target.closest('.pagination-button');
      if (!pageButton.disabled) {
        const page = parseInt(pageButton.dataset.page);
        if (page) {
          handlePageChange(page);
        }
      }
    }
  });

  // コメント投稿
  addEventListener('#submit-comment', 'click', () => handleAddComment());
  addEventListener('#new-comment-content', 'keypress', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  });

  // ユーザー名変更
  addEventListener('#current-user', 'change', () => loadPosts(1));
}

function getCurrentUser() {
  return getValue('#current-user') || 'ゲスト';
}

async function loadPosts(page = state.pagination.page) {
  try {
    const userId = getCurrentUser();
    const data = await getPosts(page, state.pagination.limit, userId);
    state.pagination = data.pagination;

    const postsHtml = data.posts
      .map(post => renderPost(post, getCurrentUser()))
      .join('');

    const paginationHtml = renderPagination(data.pagination);

    setHTML('#posts-list', postsHtml);
    setHTML('#pagination-container', paginationHtml);
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    setHTML('#posts-list', '<p>投稿の読み込みに失敗しました。</p>');
    setHTML('#pagination-container', '');
  }
}

async function handleCreatePost() {
  const content = getValue('#new-post-content').trim();
  const author = getCurrentUser();

  if (!content) {
    alert('投稿内容を入力してください。');
    return;
  }

  try {
    await createPost(author, content);
    setValue('#new-post-content', '');
    await loadPosts(1);
  } catch (error) {
    console.error('投稿の作成に失敗しました:', error);
    alert('投稿の作成に失敗しました。');
  }
}

async function handleDeletePost(postId) {
  if (!confirm('この投稿を削除しますか？')) {
    return;
  }

  try {
    await deletePost(postId);
    await loadPosts();
  } catch (error) {
    console.error('投稿の削除に失敗しました:', error);
    alert('投稿の削除に失敗しました。');
  }
}

async function handleToggleLike(postId) {
  const userId = getCurrentUser();
  const liked = isLiked(postId, userId);

  try {
    if (liked) {
      await removeLike(postId, userId);
      removeLiked(postId, userId);
    } else {
      await addLike(postId, userId);
      setLiked(postId, userId);
    }

    await loadPosts();
  } catch (error) {
    console.error('いいねの更新に失敗しました:', error);
  }
}

async function handleOpenComments(postId) {
  state.currentPostId = postId;
  await loadComments(postId);
  state.commentModal.open();
}

async function loadComments(postId) {
  try {
    const post = await getPost(postId);
    const commentsHtml = post.comments
      .map(comment => renderComment(comment))
      .join('');
    setHTML(
      '#comments-list',
      commentsHtml || '<p>コメントはまだありません。</p>'
    );
  } catch (error) {
    console.error('コメントの取得に失敗しました:', error);
    setHTML('#comments-list', '<p>コメントの読み込みに失敗しました。</p>');
  }
}

async function handleAddComment() {
  const content = getValue('#new-comment-content').trim();
  const author = getCurrentUser();

  if (!content) {
    alert('コメントを入力してください。');
    return;
  }

  try {
    await addComment(state.currentPostId, author, content);
    setValue('#new-comment-content', '');
    await loadComments(state.currentPostId);
    await loadPosts();
  } catch (error) {
    console.error('コメントの追加に失敗しました:', error);
    alert('コメントの追加に失敗しました。');
  }
}

function handlePageChange(page) {
  loadPosts(page);
}

function renderPagination(pagination) {
  const { page, totalPages, hasNext, hasPrev, totalCount, limit } = pagination;

  if (totalPages <= 1) {
    return '';
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return `
    <div class="pagination">
      <div class="pagination-info">
        ${totalCount}件中 ${startItem}-${endItem}件を表示
      </div>
      
      <div class="pagination-controls">
        <button 
          class="pagination-button ${!hasPrev ? 'disabled' : ''}" 
          data-page="${page - 1}"
          ${!hasPrev ? 'disabled' : ''}
        >
          前へ
        </button>

        ${pageNumbers
          .map(
            pageNum => `
          <button
            class="pagination-button ${page === pageNum ? 'active' : ''}"
            data-page="${pageNum}"
          >
            ${pageNum}
          </button>
        `
          )
          .join('')}

        <button 
          class="pagination-button ${!hasNext ? 'disabled' : ''}" 
          data-page="${page + 1}"
          ${!hasNext ? 'disabled' : ''}
        >
          次へ
        </button>
      </div>
    </div>
  `;
}
