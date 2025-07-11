import PostSkeleton from './PostSkeleton';

// 投稿リストのスケルトン表示
export default function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="posts-list">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={`skeleton-${index}`} />
      ))}
      
      {/* ページネーションのスケルトン */}
      <div className="pagination">
        <div className="pagination-info">
          <div className="skeleton skeleton-text skeleton-pagination-info"></div>
        </div>
        <div className="pagination-controls">
          <div className="skeleton skeleton-button skeleton-pagination-btn"></div>
          <div className="skeleton skeleton-button skeleton-pagination-btn"></div>
          <div className="skeleton skeleton-button skeleton-pagination-btn"></div>
          <div className="skeleton skeleton-button skeleton-pagination-btn"></div>
          <div className="skeleton skeleton-button skeleton-pagination-btn"></div>
        </div>
      </div>
    </div>
  );
}