'use client';

import { useState, useTransition, useOptimistic, useEffect } from 'react';
import { deletePost, addLike, removeLike } from '../actions/posts';
import { formatDate } from '../lib/utils';
import { PostProps } from '../types';

export default function Post({ post }: PostProps) {
  const [currentUser] = useState('ゲスト'); // 実際の実装では認証状態から取得
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked)); // propsから初期値を取得（number->boolean変換）
  const [likeStatusLoading, setLikeStatusLoading] = useState(false); // 初期値はfalse
  const [actualLikeCount, setActualLikeCount] = useState(post.like_count); // 実際のいいね数を管理
  
  // 楽観的更新のためのstate
  const [optimisticLikeCount, addOptimisticLikeCount] = useOptimistic(
    actualLikeCount,
    (state, newLikeCount: number) => newLikeCount
  );

  // propsのisLikedが変更された時に状態を更新
  useEffect(() => {
    console.log(`Post ${post.id} initial isLiked state:`, post.isLiked, 'converted to:', Boolean(post.isLiked));
    if (post.isLiked !== undefined) {
      setIsLiked(Boolean(post.isLiked));
    }
  }, [post.isLiked, post.id]);

  const handleDelete = () => {
    if (!confirm('この投稿を削除しますか？')) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePost(post.id);
        // 成功時はページリロード
        window.location.reload();
      } catch (error) {
        console.error('削除に失敗しました:', error);
        alert('削除に失敗しました。');
      }
    });
  };

  const handleToggleLike = () => {
    startTransition(async () => {
      const previousIsLiked = isLiked;
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);

      // 楽観的更新: 即座にいいね数を更新
      const newLikeCount = newIsLiked ? actualLikeCount + 1 : actualLikeCount - 1;
      addOptimisticLikeCount(newLikeCount);

      try {
        if (previousIsLiked) {
          // いいね済み → アンライク
          await removeLike(post.id, currentUser);
        } else {
          // 未いいね → いいね
          await addLike(post.id, currentUser);
        }
        
        // API成功後に実際のいいね数を更新
        setActualLikeCount(newLikeCount);
      } catch (error) {
        console.error('いいねの更新に失敗しました:', error);
        
        // エラー時は元に戻す
        setIsLiked(previousIsLiked);
        addOptimisticLikeCount(actualLikeCount);
      }
    });
  };

  return (
    <article className={`post ${isPending ? 'transition-loading' : ''}`}>
      <div className="post-header">
        <div className="post-author">{post.author}</div>
        <div className="post-date">{formatDate(post.created_at)}</div>
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleLike}
          disabled={isPending || likeStatusLoading}
        >
          {likeStatusLoading ? '⏳' : (isLiked ? '❤️' : '🤍')} {optimisticLikeCount}
        </button>

        <button className="comment-btn" disabled={isPending}>
          💬 {post.comment_count}
        </button>

        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={isPending}
        >
          🗑️ 削除
        </button>
      </div>
    </article>
  );
}
