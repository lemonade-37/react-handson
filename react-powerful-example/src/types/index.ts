// API関連の型定義
export interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  like_count: number;
  isLiked?: boolean | number; // サーバー側で追加されるいいね状態（SQLiteから0/1で返される）
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

// フォーム関連の型定義
export interface FormState {
  success: boolean | null;
  message: string | null;
  error: string | null;
}

// コンポーネントのProps型定義
export interface PostProps {
  post: Post;
}

export interface PostListProps {
  posts: Post[];
  pagination: Pagination;
}

export interface PaginationProps {
  pagination: Pagination;
}

export interface OptimisticPostsWrapperProps {
  initialData: PostsResponse;
  children: React.ReactNode;
}

export interface PostsPageProps {
  searchParams?: {
    page?: string;
  };
}

export interface AppProps {
  searchParams?: {
    page?: string;
  };
}

export interface TimelineSectionProps {
  searchParams?: {
    page?: string;
  };
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Server Actions関連の型定義
export interface ServerActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// 楽観的更新のアクション型定義
export type OptimisticAction = 
  | { type: 'DELETE_POST'; postId: number }
  | { type: 'TOGGLE_LIKE'; postId: number; isLiked: boolean }
  | { type: 'ADD_POST'; post: Post };