import { useState } from 'react';

function PostForm({ currentUser, onSubmit }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!content.trim()) {
      alert('投稿内容を入力してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      alert('投稿の作成に失敗しました。');
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
    <div className="post-form">
      <h2>新しい投稿</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="今何してる？"
          rows="4"
          disabled={isSubmitting}
        />
        <div className="form-actions">
          <span className="user-info">投稿者: {currentUser}</span>
          <button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
