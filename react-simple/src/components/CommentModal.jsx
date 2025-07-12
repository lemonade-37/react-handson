import { useState } from 'react';
import Comment from './Comment.jsx';
import { formatDate } from '../utils/date.js';

function CommentModal({ post, currentUser, onClose, onAddComment }) {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(post.id, commentContent.trim());
      setCommentContent('');
    } catch (error) {
      alert('コメントの追加に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="comment-modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>コメント</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="original-post">
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className="post-date">{formatDate(post.created_at)}</span>
            </div>
            <div className="post-content">{post.content}</div>
          </div>

          <div className="comments-section">
            <h4>コメント ({post.comments.length})</h4>
            <div className="comments-list">
              {post.comments.length === 0 ? (
                <p className="no-comments">コメントはまだありません。</p>
              ) : (
                post.comments.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </div>

          <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="コメントを入力（Ctrl+Enterで投稿）"
              rows="3"
              disabled={isSubmitting}
            />
            <div className="form-actions">
              <span className="user-info">投稿者: {currentUser}</span>
              <button
                type="submit"
                disabled={isSubmitting || !commentContent.trim()}
              >
                {isSubmitting ? '投稿中...' : 'コメントする'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
