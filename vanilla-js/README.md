このハンズオンを進めるためには [`vanilla-js`](.) フォルダに移動する必要があります。

# Vanilla JavaScript - SNS App 実装ガイド

## プロジェクト概要

このプロジェクトは、Vanilla JavaScript を使用したソーシャルネットワーク（掲示板）アプリケーションの実装ガイドです。
フレームワークを使わず、純粋なJavaScriptでDOM操作、状態管理、API通信を行い、投稿の作成・表示・削除・いいね・コメント機能を持つWebアプリケーションを構築します。

## 完成イメージ

- 投稿の一覧表示とページネーション
- 新規投稿の作成
- 投稿への いいね 機能
- コメントの表示と追加（モーダル）
- 投稿の削除
- ダークモード対応
- レスポンシブデザイン

## 前提条件

- Node.js がインストールされていること
- HTML、CSS、JavaScript の基本的な知識があること
- ES6+ の知識があること（import/export、アロー関数、テンプレートリテラルなど）

## 学習目標

- Vanilla JavaScript でのDOM操作
- モジュール化とコンポーネント設計
- 状態管理パターン
- イベント委譲（Event Delegation）
- API通信とエラーハンドリング

## 実装ステップ

### Step 1: プロジェクトの準備と基本HTML構造

**目標**: 基本的なVite環境を準備し、HTMLの骨組みを作成

#### 1.1 プロジェクトの初期化確認

```bash
# 現在のディレクトリで依存関係を確認
npm install
```

#### 1.2 開発サーバーの起動確認

```bash
# 開発サーバーを起動
npm run dev
```

#### 1.3 基本HTML構造の作成

`index.html` を作成し、以下の構造を実装：

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SNS掲示板</title>
  </head>
  <body>
    <div id="app">
      <header>
        <h1>SNS掲示板</h1>
        <div class="user-info">
          <label>ユーザー名: </label>
          <input
            type="text"
            id="current-user"
            placeholder="名前を入力"
            value="ゲスト"
          />
        </div>
      </header>

      <main>
        <!-- 新規投稿フォーム -->
        <div class="new-post-container">
          <h2>新しい投稿</h2>
          <textarea id="new-post-content" placeholder="今何してる？"></textarea>
          <button id="submit-post">投稿する</button>
        </div>

        <!-- 投稿一覧 -->
        <div class="posts-container">
          <h2>タイムライン</h2>
          <div id="posts-list">
            <!-- 投稿がここに表示される -->
          </div>
          <div id="pagination-container">
            <!-- ページネーションがここに表示される -->
          </div>
        </div>
      </main>

      <!-- コメントモーダル -->
      <div id="comment-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>コメント</h3>
            <button class="close-btn" id="close-modal">&times;</button>
          </div>
          <div id="comments-list"></div>
          <div class="new-comment">
            <textarea
              id="new-comment-content"
              placeholder="コメントを入力"
            ></textarea>
            <button id="submit-comment">コメントする</button>
          </div>
        </div>
      </div>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Step 2: DOM操作ユーティリティの作成

**目標**: DOM操作を効率化するユーティリティ関数を作成

#### 2.1 utilsディレクトリの作成

```bash
mkdir -p src/utils
```

#### 2.2 DOM操作ユーティリティの実装

`src/utils/dom.js` を作成：

```javascript
// DOM操作のユーティリティ関数
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.innerHTML = content;
  return element;
}

export function addEventListener(element, event, handler) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element?.addEventListener(event, handler);
}

export function setHTML(element, html) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.innerHTML = html;
}

export function getValue(element) {
  if (typeof element === 'string') {
    element = $(element);
  }
  return element.value;
}

export function setValue(element, value) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.value = value;
}
```

#### 2.3 日付フォーマットユーティリティの実装

`src/utils/date.js` を作成：

```javascript
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    return 'たった今';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}時間前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
}
```

#### 2.4 ローカルストレージユーティリティの実装

`src/utils/storage.js` を作成：

```javascript
export function getFromStorage(key) {
  return localStorage.getItem(key);
}

export function setToStorage(key, value) {
  localStorage.setItem(key, value);
}

export function removeFromStorage(key) {
  localStorage.removeItem(key);
}

export function isLiked(postId, userId) {
  return getFromStorage(`liked_${postId}_${userId}`) === 'true';
}

export function setLiked(postId, userId) {
  setToStorage(`liked_${postId}_${userId}`, 'true');
}

export function removeLiked(postId, userId) {
  removeFromStorage(`liked_${postId}_${userId}`);
}
```

### Step 3: ダミーデータとデータ管理の実装

**目標**: API連携前にダミーデータを使用してアプリケーションの動作を確認

#### 3.1 ダミーデータの作成

`src/data/dummyData.js` を作成：

```javascript
// ダミーデータの管理
let nextId = 4;

export const dummyPosts = [
  {
    id: 1,
    author: 'Alice',
    content: 'こんにちは！今日はいい天気ですね。',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    like_count: 3,
    comment_count: 2,
    comments: [
      {
        id: 1,
        author: 'Bob',
        content: 'そうですね！散歩日和です。',
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 2,
        author: 'Charlie',
        content: '私も外に出かけたいです。',
        created_at: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    author: 'Bob',
    content: 'JavaScriptの勉強をしています。難しいですが楽しいです！',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2時間前
    like_count: 5,
    comment_count: 1,
    comments: [
      {
        id: 3,
        author: 'Alice',
        content: 'がんばって！応援してます。',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 3,
    author: 'Charlie',
    content: 'みなさんこんばんは！今日も一日お疲れ様でした。',
    created_at: new Date(Date.now() - 10800000).toISOString(), // 3時間前
    like_count: 2,
    comment_count: 0,
    comments: [],
  },
];

export function addPost(author, content) {
  const newPost = {
    id: nextId++,
    author,
    content,
    created_at: new Date().toISOString(),
    like_count: 0,
    comment_count: 0,
    comments: [],
  };
  dummyPosts.unshift(newPost);
  return newPost;
}

export function deletePost(postId) {
  const index = dummyPosts.findIndex(post => post.id === parseInt(postId));
  if (index !== -1) {
    dummyPosts.splice(index, 1);
    return true;
  }
  return false;
}

export function toggleLike(postId, increment = true) {
  const post = dummyPosts.find(post => post.id === parseInt(postId));
  if (post) {
    post.like_count += increment ? 1 : -1;
    post.like_count = Math.max(0, post.like_count);
  }
}

export function addComment(postId, author, content) {
  const post = dummyPosts.find(post => post.id === parseInt(postId));
  if (post) {
    const newComment = {
      id: Date.now(),
      author,
      content,
      created_at: new Date().toISOString(),
    };
    post.comments.push(newComment);
    post.comment_count = post.comments.length;
    return newComment;
  }
  return null;
}

export function getPaginatedPosts(page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = dummyPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      totalCount: dummyPosts.length,
      totalPages: Math.ceil(dummyPosts.length / limit),
      hasNext: endIndex < dummyPosts.length,
      hasPrev: page > 1,
    },
  };
}
```

### Step 4: コンポーネントの実装

**目標**: 再利用可能なコンポーネント関数を作成

#### 4.1 componentsディレクトリの作成

```bash
mkdir -p src/components
```

#### 4.2 投稿コンポーネントの実装

`src/components/post.js` を作成：

```javascript
import { formatDate } from '../utils/date.js';
import { isLiked } from '../utils/storage.js';

export function renderPost(post, currentUser) {
  const liked = isLiked(post.id, currentUser);

  return `
    <div class="post" data-post-id="${post.id}">
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-date">${formatDate(post.created_at)}</span>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button class="like-btn ${liked ? 'liked' : ''}" data-post-id="${post.id}">
          <span class="like-icon">${liked ? '❤️' : '🤍'}</span>
          <span class="like-count">${post.like_count || 0}</span>
        </button>
        <button class="comment-btn" data-post-id="${post.id}">
          💬 ${post.comment_count || 0}
        </button>
        ${
          post.author === currentUser
            ? `<button class="delete-btn" data-post-id="${post.id}">🗑️ 削除</button>`
            : ''
        }
      </div>
    </div>
  `;
}
```

#### 4.3 コメントコンポーネントの実装

`src/components/comment.js` を作成：

```javascript
import { formatDate } from '../utils/date.js';

export function renderComment(comment) {
  return `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">${comment.author}</span>
        <span class="comment-date">${formatDate(comment.created_at)}</span>
      </div>
      <div class="comment-content">${comment.content}</div>
    </div>
  `;
}
```

#### 4.4 モーダルコンポーネントの実装

`src/components/modal.js` を作成：

```javascript
import { $, addEventListener } from '../utils/dom.js';

export function createModal(selector) {
  const modal = $(selector);
  const closeBtn = modal.querySelector('.close-btn');

  function open() {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  function close() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  // 閉じるボタンのクリック
  addEventListener(closeBtn, 'click', close);

  // 背景クリックで閉じる
  addEventListener(modal, 'click', e => {
    if (e.target === modal) {
      close();
    }
  });

  // ESCキーで閉じる
  addEventListener(document, 'keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      close();
    }
  });

  return { open, close };
}
```

### Step 5: メインアプリケーションの状態管理

**目標**: アプリケーションの状態を管理し、イベント処理を実装

#### 5.1 アプリケーションの状態管理

`src/app.js` を作成：

```javascript
import { setHTML, getValue, setValue, addEventListener } from './utils/dom.js';
import { setLiked, removeLiked, isLiked } from './utils/storage.js';
import { createModal } from './components/modal.js';
import { renderPost } from './components/post.js';
import { renderComment } from './components/comment.js';
import {
  getPaginatedPosts,
  addPost,
  deletePost,
  toggleLike,
  addComment,
  dummyPosts,
} from './data/dummyData.js';

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
  addEventListener('#submit-post', 'click', handleCreatePost);
  addEventListener('#new-post-content', 'keypress', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCreatePost();
    }
  });

  // 投稿アクション（イベント委譲）
  addEventListener(document, 'click', handlePostActions);

  // コメント投稿
  addEventListener('#submit-comment', 'click', handleAddComment);
  addEventListener('#new-comment-content', 'keypress', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  });

  // ユーザー名変更
  addEventListener('#current-user', 'change', () => loadPosts(1));
}

function handlePostActions(e) {
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
}

function getCurrentUser() {
  return getValue('#current-user') || 'ゲスト';
}

function loadPosts(page = state.pagination.page) {
  const data = getPaginatedPosts(page, state.pagination.limit);
  state.pagination = data.pagination;

  const postsHtml = data.posts
    .map(post => renderPost(post, getCurrentUser()))
    .join('');

  const paginationHtml = renderPagination(data.pagination);

  setHTML('#posts-list', postsHtml);
  setHTML('#pagination-container', paginationHtml);
}

function handleCreatePost() {
  const content = getValue('#new-post-content').trim();
  const author = getCurrentUser();

  if (!content) {
    alert('投稿内容を入力してください。');
    return;
  }

  addPost(author, content);
  setValue('#new-post-content', '');
  loadPosts(1);
}

function handleDeletePost(postId) {
  if (!confirm('この投稿を削除しますか？')) {
    return;
  }

  deletePost(postId);
  loadPosts();
}

function handleToggleLike(postId) {
  const userId = getCurrentUser();
  const liked = isLiked(postId, userId);

  if (liked) {
    toggleLike(postId, false);
    removeLiked(postId, userId);
  } else {
    toggleLike(postId, true);
    setLiked(postId, userId);
  }

  loadPosts();
}

function handleOpenComments(postId) {
  state.currentPostId = postId;
  loadComments(postId);
  state.commentModal.open();
}

function loadComments(postId) {
  const post = dummyPosts.find(p => p.id === parseInt(postId));
  if (post) {
    const commentsHtml = post.comments
      .map(comment => renderComment(comment))
      .join('');
    setHTML(
      '#comments-list',
      commentsHtml || '<p>コメントはまだありません。</p>'
    );
  }
}

function handleAddComment() {
  const content = getValue('#new-comment-content').trim();
  const author = getCurrentUser();

  if (!content) {
    alert('コメントを入力してください。');
    return;
  }

  addComment(state.currentPostId, author, content);
  setValue('#new-comment-content', '');
  loadComments(state.currentPostId);
  loadPosts();
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
```

#### 5.2 エントリーポイントの実装

`src/main.js` を作成：

```javascript
import './style.css';
import { initApp } from './app.js';

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
```

### Step 6: スタイリングの実装

**目標**: アプリケーションのスタイリングを完成させる

#### 6.1 基本スタイルの実装

`src/style.css` を作成（基本的なスタイリングを含む）：

```css
/* CSS変数の定義 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --border-color: #dee2e6;
  --text-color: #333;
  --bg-color: #fff;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f8f9fa;
    --bg-color: #1a1a1a;
    --border-color: #444;
    --light-color: #2a2a2a;
  }
}

/* 基本スタイル */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* ヘッダー */
header {
  background: var(--light-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

header h1 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info input {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
}

/* 投稿フォーム */
.new-post-container {
  background: var(--light-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.new-post-container h2 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

.new-post-container textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  background: var(--bg-color);
  color: var(--text-color);
  margin-bottom: 10px;
}

.new-post-container button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.new-post-container button:hover {
  background: #0056b3;
}

/* 投稿リスト */
.posts-container h2 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

.post {
  background: var(--light-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-author {
  font-weight: bold;
  color: var(--primary-color);
}

.post-date {
  color: var(--secondary-color);
  font-size: 0.9em;
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.post-actions button {
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.like-btn {
  background: var(--light-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.like-btn.liked {
  background: #ffe6e6;
  color: #d63384;
}

.comment-btn {
  background: var(--light-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.comment-btn:hover {
  background: var(--primary-color);
  color: white;
}

.delete-btn {
  background: var(--danger-color);
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* ページネーション */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: var(--light-color);
  border-radius: 8px;
}

.pagination-info {
  font-size: 0.9em;
  color: var(--secondary-color);
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(.disabled) {
  background: var(--primary-color);
  color: white;
}

.pagination-button.active {
  background: var(--primary-color);
  color: white;
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* モーダル */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-color);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--secondary-color);
}

.close-btn:hover {
  color: var(--danger-color);
}

/* コメント */
.comment {
  background: var(--light-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
  color: var(--primary-color);
}

.comment-date {
  color: var(--secondary-color);
  font-size: 0.8em;
}

.comment-content {
  line-height: 1.6;
}

.new-comment {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.new-comment textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  background: var(--bg-color);
  color: var(--text-color);
  margin-bottom: 10px;
}

.new-comment button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.new-comment button:hover {
  background: #0056b3;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  #app {
    padding: 10px;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-actions {
    flex-wrap: wrap;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }
}

/* モーダルが開いている時のbody */
.modal-open {
  overflow: hidden;
}
```

### Step 7: API統合への準備

**目標**: 後でAPI連携に切り替えるための準備

#### 7.1 API通信ユーティリティの実装

`src/utils/api.js` を作成（将来のAPI連携用）：

```javascript
const API_BASE = 'http://localhost:9999/api';

export async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiDelete(endpoint, data = null) {
  const options = {
    method: 'DELETE',
  };

  if (data) {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
```

#### 7.2 サービス層の実装

`src/services/postService.js` を作成（将来のAPI連携用）：

```javascript
import { apiGet, apiPost, apiDelete } from '../utils/api.js';

export async function getPosts(page = 1, limit = 10) {
  return apiGet(`/posts?page=${page}&limit=${limit}`);
}

export async function getPost(postId) {
  return apiGet(`/posts/${postId}`);
}

export async function createPost(author, content) {
  return apiPost('/posts', { author, content });
}

export async function deletePost(postId) {
  return apiDelete(`/posts/${postId}`);
}

export async function addLike(postId, userId) {
  return apiPost(`/posts/${postId}/likes`, { userId });
}

export async function removeLike(postId, userId) {
  return apiDelete(`/posts/${postId}/likes`, { userId });
}

export async function addComment(postId, author, content) {
  return apiPost(`/posts/${postId}/comments`, { author, content });
}
```

### Step 8: 機能の動作確認とテスト

**目標**: 実装した機能が正しく動作することを確認

#### 8.1 基本機能の確認

- [ ] 投稿の作成
- [ ] 投稿の表示
- [ ] 投稿の削除
- [ ] いいね機能
- [ ] コメント機能
- [ ] ページネーション
- [ ] モーダルの開閉

#### 8.2 エラーハンドリングの確認

- [ ] 空の投稿の防止
- [ ] 削除確認ダイアログ
- [ ] 適切なエラーメッセージ

#### 8.3 ユーザビリティの確認

- [ ] キーボードショートカット (Ctrl+Enter)
- [ ] レスポンシブデザイン
- [ ] ダークモード対応

### Step 9: API連携への移行（オプション）

**目標**: ダミーデータからAPI連携に切り替え

#### 9.1 バックエンドAPI起動

```bash
# 別ターミナルで
npm run dev:backend
```

#### 9.2 app.js の修正

ダミーデータの代わりにpostServiceを使用するように変更：

```javascript
// import文を変更
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  addLike,
  removeLike,
  addComment,
} from './services/postService.js';

// 関数をasync/awaitに変更
async function loadPosts(page = state.pagination.page) {
  try {
    const data = await getPosts(page, state.pagination.limit);
    // 以下同様に修正...
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    setHTML('#posts-list', '<p>投稿の読み込みに失敗しました。</p>');
  }
}
```

## 技術的なポイント

### DOM操作パターン

- **要素の取得**: `querySelector` vs `getElementById`
- **イベント委譲**: 動的に追加される要素への対応
- **テンプレートリテラル**: 動的なHTML生成

### 状態管理

- **中央集権的な状態管理**: 単一のstateオブジェクト
- **データフロー**: 状態の変更 → 再レンダリング
- **ローカルストレージ**: クライアントサイドの永続化

### モジュール化

- **ES6 Modules**: import/exportの活用
- **コンポーネント化**: 再利用可能な関数
- **関心の分離**: utils, components, services

### パフォーマンス

- **イベント委譲**: 大量の要素に対するイベントハンドリング
- **必要な時のみレンダリング**: 状態変化時のみ更新
- **効率的なDOM操作**: innerHTML vs appendChild

### エラーハンドリング

- **try-catch文**: 非同期処理のエラーハンドリング
- **ユーザーフレンドリーなエラー表示**: alertとDOM表示
- **フォームバリデーション**: 空値チェック

## 学習のポイント

### Vanilla JavaScript の利点

- **軽量**: フレームワークの依存なし
- **理解しやすい**: 直接的なDOM操作
- **パフォーマンス**: 最適化されたコード

### 実践的な開発スキル

- **DOM操作**: 効率的な要素の取得と操作
- **イベントハンドリング**: 様々なイベントの処理
- **非同期処理**: Promise/async-awaitの活用

### 設計パターン

- **MVC パターン**: Model-View-Controller の分離
- **コンポーネント指向**: 再利用可能なコンポーネント
- **状態管理**: 予測可能な状態変更

## 追加機能（チャレンジ）

### A. 投稿の編集機能

- インライン編集の実装
- 編集モードの切り替え

### B. 検索・フィルタリング機能

- 投稿内容での検索
- 作成者での絞り込み

### C. 並び替え機能

- 日付順・いいね順の切り替え
- 昇順・降順の切り替え

### D. 無限スクロール

- Intersection Observer API の活用
- 動的なデータロード

### E. オフライン対応

- Service Worker の実装
- キャッシュ戦略の実装

## トラブルシューティング

### よくある問題

1. **要素が見つからない**: DOMContentLoadedのタイミング
2. **イベントが発火しない**: イベント委譲の設定
3. **状態が更新されない**: 参照の問題
4. **スタイルが適用されない**: CSS の優先順位

### デバッグ方法

- **Console.log**: 変数の値確認
- **ブラウザ開発者ツール**: Elements/Console/Network
- **Breakpoint**: debugger文の活用

このガイドに従って段階的に実装することで、Vanilla JavaScript を使用した本格的なWebアプリケーションの開発スキルを身につけることができます。

[← プロジェクトトップに戻る](../README.md)
