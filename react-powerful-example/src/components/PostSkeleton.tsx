// スケルトン表示コンポーネント
export default function PostSkeleton() {
  return (
    <div className="post post-skeleton">
      <div className="post-header">
        <div className="skeleton skeleton-text skeleton-author"></div>
        <div className="skeleton skeleton-text skeleton-date"></div>
      </div>
      <div className="post-content">
        <div className="skeleton skeleton-text skeleton-line"></div>
        <div className="skeleton skeleton-text skeleton-line"></div>
        <div className="skeleton skeleton-text skeleton-line-short"></div>
      </div>
      <div className="post-actions">
        <div className="skeleton skeleton-button"></div>
        <div className="skeleton skeleton-button"></div>
        <div className="skeleton skeleton-button skeleton-delete"></div>
      </div>
    </div>
  );
}