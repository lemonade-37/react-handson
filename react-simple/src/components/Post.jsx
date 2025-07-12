import { formatDate } from '../utils/date.js';
import { isLiked } from '../utils/storage.js';

function Post({ post, currentUser, onLike, onComment, onDelete }) {
  const liked = isLiked(post.id, currentUser);

  return (
    <div className="post">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-date">{formatDate(post.created_at)}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="like-count">{post.like_count || 0}</span>
        </button>
        <button className="comment-btn" onClick={() => onComment(post.id)}>
          💬 {post.comment_count || 0}
        </button>
        {post.author === currentUser && (
          <button className="delete-btn" onClick={() => onDelete(post.id)}>
            🗑️ 削除
          </button>
        )}
      </div>
    </div>
  );
}

export default Post;
