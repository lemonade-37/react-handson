'use client';

import { useState, useTransition } from 'react';
import { createPost } from '../actions/posts';

export default function PostForm() {
  const [author, setAuthor] = useState('ゲスト');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    const formData = new FormData();
    formData.append('author', author);
    formData.append('content', content);

    startTransition(async () => {
      try {
        setError(null);
        await createPost(formData);
        setMessage('投稿が作成されました！');
        setContent('');
        // 成功時は少し待ってからリロード
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        setError('投稿の作成に失敗しました');
        console.error('Create post error:', err);
      }
    });
  };

  return (
    <div className="new-post-container">
      <h2>新しい投稿</h2>

      <form onSubmit={handleSubmit}>
        <div className="user-info" style={{ marginBottom: '1rem' }}>
          <label htmlFor="author">ユーザー名: </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="名前を入力"
            disabled={isPending}
          />
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="今何してる？"
          disabled={isPending}
          required
        />

        <button type="submit" disabled={isPending}>
          {isPending ? '投稿中...' : '投稿する'}
        </button>
      </form>

      {/* 状態表示 */}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">エラー: {error}</div>}
    </div>
  );
}
