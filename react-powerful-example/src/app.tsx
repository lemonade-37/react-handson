import React, { Suspense } from 'react';
import PostsPage from './components/PostsPage';
import ErrorBoundary from './components/ErrorBoundary';
import './app.css';
import { AppProps } from './types';

// RSC - Server Component
export default function App({ searchParams }: AppProps) {
  return (
    <div className="app">
      <ErrorBoundary>
        <header>
          <h1>SNS掲示板</h1>
          <div className="subtitle">
            <span>Powered by React Server Components</span>
          </div>
        </header>

        <main>
          <Suspense
            fallback={
              <div className="loading">アプリケーションを読み込み中...</div>
            }
          >
            <PostsPage searchParams={searchParams} />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
}