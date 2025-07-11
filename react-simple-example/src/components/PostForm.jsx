import { useState } from 'react';

function PostForm({ currentUser, onSubmit }) {
  const [content, setContent] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) {
      alert('投稿内容を入力してください。');
      return;
    }

    try {
      await onSubmit(currentUser, content);
      setContent('');
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      alert('投稿の作成に失敗しました。');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="new-post-container">
      <h2>新しい投稿</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="今何してる？"
          rows={4}
        />
        <button type="submit">投稿する</button>
      </form>
    </div>
  );
}

export default PostForm;
