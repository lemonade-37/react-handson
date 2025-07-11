import { Suspense } from 'react';
import Post from './Post';
import Pagination from './Pagination';
import PostSkeleton from './PostSkeleton';
import { PostListProps } from '../types';

// RSC - Server Component
export default function PostList({ posts, pagination }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="empty">
        投稿がありません。最初の投稿を作成してみましょう！
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map(post => (
        <Suspense
          key={post.id}
          fallback={<PostSkeleton />}
        >
          <Post post={post} />
        </Suspense>
      ))}

      {pagination && pagination.totalPages > 1 && (
        <Suspense
          fallback={
            <div className="pagination-loading">
              ページネーションを読み込み中...
            </div>
          }
        >
          <Pagination pagination={pagination} />
        </Suspense>
      )}
    </div>
  );
}
