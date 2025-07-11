'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '../actions/posts';
import PostList from './PostList';
import PostListSkeleton from './PostListSkeleton';
import { PostsResponse } from '../types';

// Client Component - タイムライン部分
export default function TimelineSection() {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const userId = 'ゲスト';
  const limit = 10;

  // URLパラメータからページ番号を取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page') || '1') || 1;
    setCurrentPage(page);
  }, []);

  // ページ変更をリッスン
  useEffect(() => {
    const handlePageChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get('page') || '1') || 1;
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePageChange);
    
    return () => {
      window.removeEventListener('popstate', handlePageChange);
    };
  }, []);

  // データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching posts for page:', currentPage);
        
        const result = await getPosts(currentPage, limit, userId);
        setData(result);
      } catch (err) {
        console.error('Timeline error:', err);
        setError('データの読み込みに失敗しました。しばらくしてからやり直してください。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, userId]);

  if (loading) {
    return (
      <div className="posts-container">
        <h2>タイムライン</h2>
        <PostListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-container">
        <h2>タイムライン</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="posts-container">
        <h2>タイムライン</h2>
        <div className="error">データが見つかりません。</div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <h2>タイムライン</h2>
      <PostList
        posts={data.posts}
        pagination={data.pagination}
      />
    </div>
  );
}