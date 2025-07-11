import { useState, useEffect } from 'react';
import { getPost, addComment } from '../services/postService';
import Comment from './Comment';

function CommentModal({
  postId,
  currentUser,
  isOpen,
  onClose,
  onCommentAdded,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const post = await getPost(postId);
      setComments(post.comments || []);
    } catch (error) {
      console.error('コメントの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    try {
      await addComment(postId, currentUser, newComment);
      setNewComment('');
      await loadComments();
      onCommentAdded();
    } catch (error) {
      console.error('コメントの追加に失敗しました:', error);
      alert('コメントの追加に失敗しました。');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>コメント</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="comments-list">
          {isLoading ? (
            <div>コメントを読み込み中...</div>
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <div>コメントはまだありません。</div>
          )}
        </div>

        <div className="new-comment">
          <form onSubmit={handleSubmit}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="コメントを入力"
              rows={3}
            />
            <button type="submit">コメントする</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
