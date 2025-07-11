// 日時をフォーマットする関数
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    return 'たった今';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}時間前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
}
