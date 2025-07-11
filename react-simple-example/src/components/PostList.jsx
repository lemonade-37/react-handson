import Post from './Post';
import Pagination from './Pagination';

function PostList({
  posts,
  currentUser,
  onLike,
  onComment,
  onDelete,
  isLoading,
  error,
  pagination,
  onPageChange,
}) {
  if (isLoading) {
    return <div className="loading">投稿を読み込み中...</div>;
  }

  if (error) {
    return <div className="error">投稿の読み込みに失敗しました。</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="empty">投稿がありません。</div>;
  }

  return (
    <div className="posts-container">
      <h2>タイムライン</h2>
      <div className="posts-list">
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
        ))}
      </div>
      {pagination && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}

export default PostList;
