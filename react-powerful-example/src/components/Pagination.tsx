'use client';

import { useTransition } from 'react';
import { PaginationProps } from '../types';

export default function Pagination({ pagination }: PaginationProps) {
  const [isPending, startTransition] = useTransition();

  const { page, totalPages, hasNext, hasPrev, totalCount, limit } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    startTransition(() => {
      // URLパラメータを更新してページを変更
      const url = new URL(window.location);
      url.searchParams.set('page', newPage.toString());
      window.location.href = url.toString();
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className={`pagination ${isPending ? 'transition-loading' : ''}`}>
      <div className="pagination-info">
        {totalCount}件中 {startItem}-{endItem}件を表示
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev || isPending}
          className="pagination-button"
        >
          前へ
        </button>

        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={isPending}
            className={`pagination-button ${page === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext || isPending}
          className="pagination-button"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
