'use server';

import { PostsResponse, Post, Comment, ServerActionResponse } from '../types';

// バックエンドAPIのベースURL
const API_BASE = 'http://localhost:9999/api';

// 投稿を取得する Server Action（いいね状態付き）
export async function getPosts(page = 1, limit = 10, userId = 'ゲスト'): Promise<PostsResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/posts?page=${page}&limit=${limit}&userId=${encodeURIComponent(userId)}`,
      {
        cache: 'no-store', // 常に最新のデータを取得
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data: PostsResponse = await response.json();
    
    // バックエンドからいいね状態付きのデータが返ってくる
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// 投稿を作成する Server Action
export async function createPost(formData: FormData): Promise<Post> {
  try {
    const author = formData.get('author');
    const content = formData.get('content');

    if (!author || !content) {
      throw new Error('Author and content are required');
    }

    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: author.toString(),
        content: content.toString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const data: Post = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// 投稿を削除する Server Action
export async function deletePost(postId: number): Promise<ServerActionResponse> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// いいねを追加する Server Action
export async function addLike(postId: number, userId: string): Promise<ServerActionResponse> {
  try {
    console.log('Adding like for post:', postId, 'user:', userId);
    
    const response = await fetch(`${API_BASE}/posts/${postId}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    console.log('Like API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Like API error response:', errorText);
      
      // 400エラー（Already liked）の場合は、既にいいね済みとして扱う
      if (response.status === 400 && errorText.includes('Already liked')) {
        console.log('Already liked, treating as success');
        return { success: true };
      }
      
      throw new Error(`Failed to add like: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Like added successfully:', result);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
}

// いいねを削除する Server Action
export async function removeLike(postId: number, userId: string): Promise<ServerActionResponse> {
  try {
    console.log('Removing like for post:', postId, 'user:', userId);
    
    const response = await fetch(`${API_BASE}/posts/${postId}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    console.log('Remove like API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove like API error response:', errorText);
      
      // 400エラー（Not liked）の場合は、既にいいね解除済みとして扱う
      if (response.status === 400 && (errorText.includes('Not liked') || errorText.includes('not found'))) {
        console.log('Not liked, treating as success');
        return { success: true };
      }
      
      throw new Error(`Failed to remove like: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Like removed successfully:', result);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
}

// いいね状態を取得する Server Action
export async function getLikeStatus(postId: number, userId: string): Promise<{ isLiked: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/likes/${userId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to get like status');
    }

    const data = await response.json();
    return { isLiked: data.isLiked };
  } catch (error) {
    console.error('Error getting like status:', error);
    return { isLiked: false };
  }
}

// コメントを追加する Server Action
export async function addComment(formData: FormData): Promise<Comment> {
  try {
    const postId = formData.get('postId');
    const author = formData.get('author');
    const content = formData.get('content');

    if (!postId || !author || !content) {
      throw new Error('PostId, author and content are required');
    }

    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: author.toString(),
        content: content.toString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const data: Comment = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}
