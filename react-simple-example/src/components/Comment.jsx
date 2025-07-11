import { formatDate } from '../utils/date.js';

function Comment({ comment }) {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
      </div>
      <div className="comment-content">{comment.content}</div>
    </div>
  );
}

export default Comment;
