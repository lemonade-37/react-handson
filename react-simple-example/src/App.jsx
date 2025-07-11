import { useState, useEffect } from 'react';
import './App.css';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import CommentModal from './components/CommentModal';
import {
  getPosts,
  createPost,
  deletePost,
  addLike,
  removeLike,
} from './services/postService';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState('ゲスト');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadPosts = async (page = pagination.page) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPosts(page, pagination.limit, currentUser);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError('投稿の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (author, content) => {
    await createPost(author, content);
    await loadPosts(1);
  };

  const handleDeletePost = async postId => {
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
  };

  const handleToggleLike = async postId => {
    const post = posts.find(p => p.id === postId);
    const liked = post?.isLiked || false;

    try {
      if (liked) {
        await removeLike(postId, currentUser);
      } else {
        await addLike(postId, currentUser);
      }

      await loadPosts();
    } catch (error) {
      console.error('いいねの更新に失敗しました:', error);
    }
  };

  const handleOpenComments = postId => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedPostId(null);
  };

  const handleCommentAdded = async () => {
    await loadPosts();
  };

  const handlePageChange = page => {
    loadPosts(page);
  };

  return (
    <div className="app">
      <header>
        <h1>SNS掲示板</h1>
        <div className="user-info">
          <label>ユーザー名: </label>
          <input
            type="text"
            value={currentUser}
            onChange={e => setCurrentUser(e.target.value)}
            placeholder="名前を入力"
          />
        </div>
      </header>

      <main>
        <PostForm currentUser={currentUser} onSubmit={handleCreatePost} />

        <PostList
          posts={posts}
          currentUser={currentUser}
          onLike={handleToggleLike}
          onComment={handleOpenComments}
          onDelete={handleDeletePost}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </main>

      <CommentModal
        postId={selectedPostId}
        currentUser={currentUser}
        isOpen={commentModalOpen}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}

export default App;
