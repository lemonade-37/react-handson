# React Server Components ハンズオン

> **⚠️ 注意**: このプロジェクトは実験的な React Server Components の実装です。非常に不安定で、エラーが発生する可能性があります。

## 📋 このハンズオンで学ぶこと

- **React Server Components (RSC)** の基本概念
- **useOptimistic** による楽観的更新
- **Server Actions** によるサーバー側処理
- **Suspense** による非同期レンダリング
- **Client Components** と **Server Components** の使い分け

## 🚀 セットアップ

### 1. 依存関係のインストール

⚠️ **重要**: このプロジェクトはワークスペースに含まれていないため、個別に依存関係をインストールする必要があります。

```bash
cd react-powerful
npm install
```

### 2. バックエンドサーバーの起動

別のターミナルで：

```bash
# プロジェクトルートに戻る
cd ..
npm run dev:backend
```

### 3. 開発サーバーの起動

```bash
# react-powerful ディレクトリで
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 📚 ハンズオン手順

### Step 1: React Server Components の理解

#### 1.1 Server Components とは

React Server Components は、**サーバー側でレンダリングされる React コンポーネント**です。

**特徴:**
- サーバー側でレンダリング
- データベースへの直接アクセス可能
- JavaScript bundle に含まれない
- インタラクティブな要素は含められない

#### 1.2 Client Components との違い

| Server Components | Client Components |
|-------------------|-------------------|
| サーバー側で実行 | ブラウザ側で実行 |
| データベース直接アクセス | API経由でデータ取得 |
| 状態管理不可 | useState, useEffect 使用可 |
| イベントハンドラー不可 | onClick など使用可 |

### Step 2: 基本的な Server Component の作成

#### 2.1 PostList Server Component

`src/components/PostList.tsx` を作成：

```tsx
// Server Component（デフォルト）
interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
}

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch('http://localhost:9999/api/posts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('投稿の取得に失敗しました:', error);
    return [];
  }
}

export default async function PostList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>まだ投稿がありません。</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>投稿一覧</h2>
      {posts.map(post => (
        <article key={post.id} className="post">
          <div className="post-header">
            <h3>{post.author}</h3>
            <time>{new Date(post.created_at).toLocaleString()}</time>
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-stats">
            <span>👍 {post.like_count}</span>
            <span>💬 {post.comment_count}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
```

#### 2.2 App.tsx の更新

```tsx
import { Suspense } from 'react';
import PostList from './components/PostList.tsx';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>React Server Components SNS</h1>
      </header>
      
      <main>
        <Suspense fallback={<div>投稿を読み込み中...</div>}>
          <PostList />
        </Suspense>
      </main>
    </div>
  );
}
```

### Step 3: Client Component の作成

#### 3.1 Client Component の基本

Client Component は **'use client'** ディレクティブで明示的に指定します。

#### 3.2 Post Client Component

`src/components/Post.tsx` を作成：

```tsx
'use client';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const handleLike = () => {
    // ここにいいね機能を実装
    console.log('いいね！', post.id);
  };

  const handleDelete = () => {
    // ここに削除機能を実装
    console.log('削除', post.id);
  };

  return (
    <article className="post">
      <div className="post-header">
        <h3>{post.author}</h3>
        <time>{new Date(post.created_at).toLocaleString()}</time>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      <div className="post-actions">
        <button onClick={handleLike}>
          👍 {post.like_count}
        </button>
        <button onClick={handleDelete}>
          🗑️ 削除
        </button>
      </div>
    </article>
  );
}
```

### Step 4: useOptimistic による楽観的更新

#### 4.1 useOptimistic とは

**useOptimistic** は React 19 の新しい Hook で、サーバーアクションの完了を待たずに UI を楽観的に更新します。

**仕組み:**
1. ユーザーアクション（いいねボタンクリック）
2. **即座に UI を更新**（楽観的更新）
3. バックグラウンドでサーバーに送信
4. サーバーレスポンスで最終的な状態を確定

#### 4.2 useOptimistic の実装

Post.tsx を更新：

```tsx
'use client';

import { useOptimistic, useTransition } from 'react';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  isLiked?: boolean;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const [isPending, startTransition] = useTransition();
  
  // useOptimistic の使用
  const [optimisticPost, updateOptimisticPost] = useOptimistic(
    post,
    (currentPost, action: { type: string; increment?: boolean }) => {
      switch (action.type) {
        case 'LIKE':
          return {
            ...currentPost,
            like_count: currentPost.like_count + (action.increment ? 1 : -1),
            isLiked: action.increment,
          };
        default:
          return currentPost;
      }
    }
  );

  const handleLike = () => {
    const isCurrentlyLiked = optimisticPost.isLiked;
    const increment = !isCurrentlyLiked;

    // 楽観的更新
    updateOptimisticPost({
      type: 'LIKE',
      increment,
    });

    // サーバーアクション実行
    startTransition(async () => {
      try {
        // ここでサーバーアクションを呼び出す
        await likePost(post.id, increment);
      } catch (error) {
        console.error('いいねの更新に失敗しました:', error);
        // エラー時は元に戻す
        updateOptimisticPost({
          type: 'LIKE',
          increment: !increment,
        });
      }
    });
  };

  return (
    <article className="post">
      <div className="post-header">
        <h3>{optimisticPost.author}</h3>
        <time>{new Date(optimisticPost.created_at).toLocaleString()}</time>
      </div>
      
      <div className="post-content">
        <p>{optimisticPost.content}</p>
      </div>
      
      <div className="post-actions">
        <button 
          onClick={handleLike}
          disabled={isPending}
          className={optimisticPost.isLiked ? 'liked' : ''}
        >
          👍 {optimisticPost.like_count}
        </button>
        
        {isPending && <span>更新中...</span>}
      </div>
    </article>
  );
}

// Server Action（後で実装）
async function likePost(postId: number, increment: boolean) {
  // サーバーアクション実装
}
```

### Step 5: Server Actions の実装

#### 5.1 Server Actions とは

Server Actions は **'use server'** ディレクティブで定義される、サーバー側で実行される関数です。

#### 5.2 actions.ts の作成

`src/lib/actions.ts` を作成：

```tsx
'use server';

import { revalidatePath } from '@lazarv/react-server';

export async function likePost(postId: number, increment: boolean) {
  try {
    const response = await fetch(`http://localhost:9999/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ページを再検証して最新データを反映
    revalidatePath('/');
    
    return await response.json();
  } catch (error) {
    console.error('Server Action - likePost:', error);
    throw error;
  }
}

export async function createPost(author: string, content: string) {
  try {
    const response = await fetch('http://localhost:9999/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    revalidatePath('/');
    return await response.json();
  } catch (error) {
    console.error('Server Action - createPost:', error);
    throw error;
  }
}
```

### Step 6: 投稿フォームの作成

#### 6.1 PostForm Client Component

`src/components/PostForm.tsx` を作成：

```tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { createPost } from '../lib/actions';

interface OptimisticPost {
  id: number;
  author: string;
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  isPending?: boolean;
}

export default function PostForm() {
  const [isPending, startTransition] = useTransition();
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    [] as OptimisticPost[],
    (state, newPost: OptimisticPost) => [...state, newPost]
  );

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get('content') as string;
    const author = (formData.get('author') as string) || 'Anonymous';
    
    if (!content?.trim()) {
      alert('投稿内容を入力してください。');
      return;
    }

    // 楽観的更新
    const optimisticPost: OptimisticPost = {
      id: Date.now(),
      author,
      content: content.trim(),
      created_at: new Date().toISOString(),
      like_count: 0,
      comment_count: 0,
      isPending: true,
    };

    addOptimisticPost(optimisticPost);

    // サーバーアクション実行
    startTransition(async () => {
      try {
        await createPost(author, content);
      } catch (error) {
        console.error('投稿の作成に失敗しました:', error);
        alert('投稿の作成に失敗しました。');
      }
    });
  };

  return (
    <div className="post-form">
      <h2>新規投稿</h2>
      <form action={handleSubmit}>
        <div>
          <label htmlFor="author">名前：</label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="あなたの名前"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label htmlFor="content">投稿内容：</label>
          <textarea
            id="content"
            name="content"
            placeholder="今何してる？"
            rows={3}
            disabled={isPending}
            required
          />
        </div>
        
        <button type="submit" disabled={isPending}>
          {isPending ? '投稿中...' : '投稿する'}
        </button>
      </form>

      {/* 楽観的更新の確認 */}
      {optimisticPosts.length > 0 && (
        <div className="optimistic-preview">
          <h3>送信中の投稿</h3>
          {optimisticPosts.map(post => (
            <div key={post.id} className="post-preview">
              <strong>{post.author}</strong>: {post.content}
              {post.isPending && <span>送信中...</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 7: 完成版の実装

#### 7.1 App.tsx の最終更新

```tsx
import { Suspense } from 'react';
import PostList from './components/PostList.tsx';
import PostForm from './components/PostForm.tsx';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Server Components SNS</h1>
        <p>React 19 + RSC + useOptimistic のデモ</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <PostForm />
          <Suspense fallback={<div>投稿を読み込み中...</div>}>
            <PostList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
```

## 🎯 React Server Components の重要ポイント

### 1. Server Components の特徴

```tsx
// ✅ Server Component でできること
export default async function ServerComponent() {
  // データベースやファイルシステムへの直接アクセス
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  // サーバーサイドでのデータ処理
  const filteredPosts = posts.filter(post => post.published);
  
  return <div>{/* JSX */}</div>;
}

// ❌ Server Component でできないこと
export default function ServerComponent() {
  // useState, useEffect などの React Hooks
  const [state, setState] = useState(0); // エラー！
  
  // イベントハンドラー
  const handleClick = () => {}; // エラー！
  
  // ブラウザ API
  localStorage.setItem('key', 'value'); // エラー！
  
  return <button onClick={handleClick}>クリック</button>; // エラー！
}
```

### 2. useOptimistic の使用パターン

```tsx
const [optimisticState, updateOptimisticState] = useOptimistic(
  initialState,
  (currentState, action) => {
    // 楽観的更新のロジック
    return newState;
  }
);

// 使用例
updateOptimisticState({
  type: 'LIKE',
  increment: true,
});
```

### 3. Server Actions の注意点

```tsx
'use server';

// ✅ 正しい Server Action
export async function serverAction(formData: FormData) {
  const data = formData.get('field');
  // サーバーサイドでの処理
  await processData(data);
  revalidatePath('/'); // 重要：データを再検証
}

// ❌ 間違った使用法
export async function serverAction() {
  // クライアントサイドの状態にアクセス
  const state = useState(0); // エラー！
}
```

## 🔧 トラブルシューティング

### よくあるエラーと対処法

1. **"Cannot use hooks in Server Components"**
   - Server Component で React Hooks を使用しようとしている
   - `'use client'` ディレクティブを追加

2. **"Server Action must be marked with 'use server'"**
   - Server Action に `'use server'` ディレクティブがない
   - ファイルの先頭に `'use server'` を追加

3. **"Module not found"**
   - @lazarv/react-server のバージョンが古い
   - `npm install @lazarv/react-server@latest`

## 📚 参考資料

- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [React 19 Documentation](https://react.dev/blog/2024/04/25/react-19)
- [@lazarv/react-server Documentation](https://github.com/lazarv/react-server)

---

**Happy Coding with React Server Components! 🚀**