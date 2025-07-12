import { useState, useEffect } from 'react';
import PostForm from './components/PostForm.jsx';
import PostList from './components/PostList.jsx';
import { setLiked, removeLiked, isLiked } from './utils/storage.js';
import {
  getPaginatedPosts,
  addPost,
  deletePost,
  toggleLike,
  addComment,
  getPostById,
} from './data/dummyData.js';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState('ゲスト');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedPost, setSelectedPost] = useState(null);

  // 投稿データの読み込み
  const loadPosts = (page = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const data = getPaginatedPosts(page, pagination.limit);
      setPosts(data.posts);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('投稿の読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // 初期データの読み込み
  useEffect(() => {
    loadPosts(1);
  }, []);

  // 新規投稿の作成
  const handleCreatePost = async content => {
    try {
      addPost(currentUser, content);
      loadPosts(1); // 最初のページに戻る
    } catch (err) {
      throw new Error('投稿の作成に失敗しました。');
    }
  };

  // いいねの切り替え
  const handleLike = postId => {
    const liked = isLiked(postId, currentUser);

    if (liked) {
      toggleLike(postId, false);
      removeLiked(postId, currentUser);
    } else {
      toggleLike(postId, true);
      setLiked(postId, currentUser);
    }

    loadPosts();
  };

  // コメントモーダルの表示
  const handleComment = postId => {
    const post = getPostById(postId);
    setSelectedPost(post);
  };

  // 投稿の削除
  const handleDelete = postId => {
    if (window.confirm('この投稿を削除しますか？')) {
      deletePost(postId);
      loadPosts();
    }
  };

  // ページ変更
  const handlePageChange = page => {
    loadPosts(page);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>SNS掲示板</h1>
        <div className="user-controls">
          <label>
            ユーザー名:
            <input
              type="text"
              value={currentUser}
              onChange={e => setCurrentUser(e.target.value)}
              placeholder="名前を入力"
            />
          </label>
        </div>
      </header>

      <main className="app-main">
        <PostForm currentUser={currentUser} onSubmit={handleCreatePost} />

        <div className="posts-section">
          <h2>タイムライン</h2>
          <PostList
            posts={posts}
            loading={loading}
            error={error}
            currentUser={currentUser}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
          />

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                {pagination.totalCount}件中{' '}
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}
                件を表示
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  前へ
                </button>
                <span className="page-info">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  次へ
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedPost && (
          <div className="comment-modal" onClick={() => setSelectedPost(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>コメント</h3>
                <button
                  className="close-btn"
                  onClick={() => setSelectedPost(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="original-post">
                  <strong>{selectedPost.author}</strong>: {selectedPost.content}
                </div>
                <div className="comments-list">
                  {selectedPost.comments.length === 0 ? (
                    <p>コメントはまだありません。</p>
                  ) : (
                    selectedPost.comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <strong>{comment.author}</strong>
                          <span className="comment-date">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="comment-form">
                  <textarea
                    placeholder="コメントを入力"
                    onKeyPress={e => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        const content = e.target.value.trim();
                        if (content) {
                          addComment(selectedPost.id, currentUser, content);
                          e.target.value = '';
                          setSelectedPost(getPostById(selectedPost.id)); // 更新
                          loadPosts(); // 投稿一覧も更新
                        }
                      }
                    }}
                  />
                  <button
                    onClick={e => {
                      const textarea = e.target.previousElementSibling;
                      const content = textarea.value.trim();
                      if (content) {
                        addComment(selectedPost.id, currentUser, content);
                        textarea.value = '';
                        setSelectedPost(getPostById(selectedPost.id)); // 更新
                        loadPosts(); // 投稿一覧も更新
                      }
                    }}
                  >
                    コメントする
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
