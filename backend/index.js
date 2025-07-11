import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import db from './db.js';

const BASE_DELAY = 500; // デフォルトの遅延時間（ミリ秒）

// ランダムな遅延を生成する関数
function getRandomDelay() {
  // 3%の確率で1500ms（1000ms + 500ms）
  if (Math.random() < 0.03) {
    return 1000 + BASE_DELAY;
  }
  // 97%の確率で600ms〜800ms（100ms〜300ms + 500ms）
  return Math.floor(Math.random() * 301) + BASE_DELAY;
}

// 遅延を追加する関数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const app = new Hono();

// CORS設定
app.use('/*', cors());

// ヘルスチェック
app.get('/', c => {
  return c.json({ message: 'Bulletin Board API is running!' });
});

// 投稿一覧取得（コメント数、いいね数付き、ページネーション対応）
app.get('/api/posts', async c => {
  const page = parseInt(c.req.query('page')) || 1;
  const limit = parseInt(c.req.query('limit')) || 10;
  const userId = c.req.query('userId') ? decodeURIComponent(c.req.query('userId')) : null;
  const offset = (page - 1) * limit;

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(
    `Getting posts with ${delayMs}ms delay (page: ${page}, limit: ${limit}, userId: ${userId})`
  );
  await delay(delayMs);

  // 投稿の総数を取得
  const totalCount = db
    .prepare(
      `
    SELECT COUNT(*) as count FROM posts
  `
    )
    .get().count;

  let posts;
  if (userId) {
    // ユーザーのいいね状態を含む投稿一覧を取得
    posts = db
      .prepare(
        `
      SELECT 
        p.*,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count,
        CASE WHEN ul.user_id IS NOT NULL THEN 1 ELSE 0 END as isLiked
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `
      )
      .all(userId, limit, offset);
  } else {
    // いいね状態なしの投稿一覧を取得
    posts = db
      .prepare(
        `
      SELECT 
        p.*,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `
      )
      .all(limit, offset);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return c.json({
    posts,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
});

// 投稿詳細取得（コメント付き）
app.get('/api/posts/:id', async c => {
  const id = c.req.param('id');

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Getting post ${id} with ${delayMs}ms delay`);
  await delay(delayMs);

  const post = db
    .prepare(
      `
    SELECT 
      p.*,
      COUNT(DISTINCT l.id) as like_count
    FROM posts p
    LEFT JOIN likes l ON p.id = l.post_id
    WHERE p.id = ?
    GROUP BY p.id
  `
    )
    .get(id);

  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }

  const comments = db
    .prepare(
      `
    SELECT * FROM comments 
    WHERE post_id = ? 
    ORDER BY created_at ASC
  `
    )
    .all(id);

  return c.json({ ...post, comments });
});

// 新規投稿作成
app.post('/api/posts', async c => {
  const body = await c.req.json();
  const { author, content } = body;

  if (!author || !content) {
    return c.json({ error: 'Author and content are required' }, 400);
  }

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Creating post with ${delayMs}ms delay`);
  await delay(delayMs);

  const result = db
    .prepare('INSERT INTO posts (author, content) VALUES (?, ?)')
    .run(author, content);

  const newPost = db
    .prepare('SELECT * FROM posts WHERE id = ?')
    .get(result.lastInsertRowid);

  return c.json(newPost, 201);
});

// 投稿削除
app.delete('/api/posts/:id', async c => {
  const id = c.req.param('id');

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Deleting post with ${delayMs}ms delay`);
  await delay(delayMs);

  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);

  if (result.changes === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ message: 'Post deleted successfully' });
});

// コメント追加
app.post('/api/posts/:id/comments', async c => {
  const postId = c.req.param('id');
  const body = await c.req.json();
  const { author, content } = body;

  if (!author || !content) {
    return c.json({ error: 'Author and content are required' }, 400);
  }

  // 投稿が存在するかチェック
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Creating comment with ${delayMs}ms delay`);
  await delay(delayMs);

  const result = db
    .prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)')
    .run(postId, author, content);

  const newComment = db
    .prepare('SELECT * FROM comments WHERE id = ?')
    .get(result.lastInsertRowid);

  return c.json(newComment, 201);
});

// いいね追加
app.post('/api/posts/:id/likes', async c => {
  const postId = c.req.param('id');
  const body = await c.req.json();
  const { userId } = body;

  if (!userId) {
    return c.json({ error: 'UserId is required' }, 400);
  }

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Adding like with ${delayMs}ms delay`);
  await delay(delayMs);

  try {
    const result = db
      .prepare('INSERT INTO likes (post_id, user_id) VALUES (?, ?)')
      .run(postId, userId);

    return c.json({ message: 'Like added successfully' }, 201);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return c.json({ error: 'Already liked' }, 400);
    }
    throw error;
  }
});

// いいね削除
app.delete('/api/posts/:id/likes', async c => {
  const postId = c.req.param('id');
  const body = await c.req.json();
  const { userId } = body;

  if (!userId) {
    return c.json({ error: 'UserId is required' }, 400);
  }

  // ランダムな遅延を追加
  const delayMs = getRandomDelay();
  console.log(`Removing like with ${delayMs}ms delay`);
  await delay(delayMs);

  const result = db
    .prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?')
    .run(postId, userId);

  if (result.changes === 0) {
    return c.json({ error: 'Like not found' }, 404);
  }

  return c.json({ message: 'Like removed successfully' });
});

// いいね状態を取得
app.get('/api/posts/:id/likes/:userId', async c => {
  const postId = c.req.param('id');
  const userId = decodeURIComponent(c.req.param('userId'));

  if (!userId) {
    return c.json({ error: 'UserId is required' }, 400);
  }

  const like = db
    .prepare('SELECT * FROM likes WHERE post_id = ? AND user_id = ?')
    .get(postId, userId);

  return c.json({ 
    isLiked: !!like,
    postId: parseInt(postId),
    userId 
  });
});

// サーバー起動
const port = 9999;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
