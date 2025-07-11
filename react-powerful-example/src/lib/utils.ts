// 日付フォーマット関数
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'たった今';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  } else if (diffInDays < 7) {
    return `${diffInDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

// LocalStorage関連のユーティリティ
export function isLiked(postId: number, userId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    return likes[`${postId}_${userId}`] || false;
  } catch {
    return false;
  }
}

export function setLiked(postId: number, userId: string, liked = true): void {
  if (typeof window === 'undefined') return;

  try {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    likes[`${postId}_${userId}`] = liked;
    localStorage.setItem('likes', JSON.stringify(likes));
  } catch (error) {
    console.error('Failed to save like status:', error);
  }
}

export function removeLiked(postId: number, userId: string): void {
  setLiked(postId, userId, false);
}

// デバウンス関数
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// スロットル関数
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
