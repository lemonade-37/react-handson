import Post from './Post.jsx';

function PostList({
  posts,
  loading,
  error,
  currentUser,
  onLike,
  onComment,
  onDelete,
}) {
  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="empty">投稿はまだありません。</div>;
  }

  return (
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
  );
}

export default PostList;
