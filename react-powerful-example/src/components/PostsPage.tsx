import { Suspense } from 'react';
import PostForm from './PostForm';
import TimelineSection from './TimelineSection';
import { PostsPageProps } from '../types';

// RSC - Server Component
export default function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <>
      {/* 投稿フォーム - ページネーション時も変更されない */}
      <Suspense
        fallback={<div className="loading">投稿フォームを読み込み中...</div>}
      >
        <PostForm />
      </Suspense>

      {/* タイムライン部分 */}
      <TimelineSection />
    </>
  );
}
