'use client';

import { Suspense } from 'react';
import Post from './Post';
import PostSkeleton from './PostSkeleton';
import { Post as PostType } from '../types';

interface OptimisticPostListProps {
  posts: PostType[];
}

// Client Component - 投稿リストを表示
export default function OptimisticPostList({ posts }: OptimisticPostListProps) {
  return (
    <>
      {posts.map(post => (
        <Suspense
          key={post.id}
          fallback={<PostSkeleton />}
        >
          <Post post={post} />
        </Suspense>
      ))}
    </>
  );
}