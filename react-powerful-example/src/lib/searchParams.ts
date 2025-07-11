// React Server Components用のsearchParams取得関数
export function getSearchParams(): { page?: string } {
  // サーバー側では取得できないため、デフォルト値を返す
  if (typeof window === 'undefined') {
    return {};
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    page: urlParams.get('page') || undefined
  };
}