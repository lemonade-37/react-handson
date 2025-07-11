import Database from 'better-sqlite3';
import { existsSync } from 'fs';

const dbPath = './bulletin.db';
const isNewDb = !existsSync(dbPath);
const db = new Database(dbPath);

// データベースの初期化
if (isNewDb) {
  // postsテーブルの作成
  db.exec(`
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // commentsテーブルの作成
  db.exec(`
    CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  // likesテーブルの作成
  db.exec(`
    CREATE TABLE likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  // サンプルデータの挿入
  const insertPost = db.prepare(
    'INSERT INTO posts (author, content) VALUES (?, ?)'
  );
  const insertComment = db.prepare(
    'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)'
  );
  const insertLike = db.prepare(
    'INSERT INTO likes (post_id, user_id) VALUES (?, ?)'
  );

  // ダミーデータ生成用の配列
  const authors = [
    '太郎',
    '花子',
    '次郎',
    '三郎',
    '四郎',
    '五郎',
    '佳子',
    '美咲',
    '健太',
    '翔太',
  ];
  const contents = [
    '今日はいい天気ですね！散歩日和です🌞',
    'TypeScriptの勉強を始めました！難しいけど楽しい😊',
    '新しいカフェを見つけました。コーヒーが美味しかった☕',
    'Reactのhooksって便利ですね！useState最高！',
    '朝ごはんはパンケーキにしました🥞',
    'プログラミングは楽しい！毎日コードを書いています',
    '週末は映画を見に行く予定です🎬',
    '最近読んだ本がとても面白かった📚',
    'ジムで運動してきました💪',
    '新しいプロジェクトを始めました！ワクワクする',
    '今日の夕飯は何にしようかな🍕',
    'GitHubにコードをプッシュしました！',
    '散歩中に猫を見かけました🐱',
    'JavaScript難しい...でも頑張る！',
    'コーヒーブレイク中☕',
    '友達とランチしてきました🍜',
    '新しい技術を学ぶのは大変だけど楽しい',
    '今日も一日お疲れ様でした',
    '朝活始めました！早起きは三文の徳',
    'デバッグが終わらない...😅',
  ];

  const commentContents = [
    'いいね！',
    '素晴らしい！',
    '頑張って！',
    'おめでとう！',
    'そうなんですね',
    '私もそう思います',
    '楽しそう！',
    '羨ましい〜',
    'お疲れ様です',
    'すごい！',
    '共感します',
    'ファイト！',
    '応援してます',
    'なるほど',
    'それは大変でしたね',
  ];

  // 100件の投稿を生成
  const postIds = [];
  for (let i = 0; i < 100; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const result = insertPost.run(author, content);
    postIds.push(result.lastInsertRowid);
  }

  // 各投稿にランダムにコメントといいねを追加
  postIds.forEach((postId, index) => {
    // 0-3個のコメントを追加
    const commentCount = Math.floor(Math.random() * 4);
    for (let i = 0; i < commentCount; i++) {
      const commentAuthor = authors[Math.floor(Math.random() * authors.length)];
      const commentContent =
        commentContents[Math.floor(Math.random() * commentContents.length)];
      insertComment.run(postId, commentAuthor, commentContent);
    }

    // 0-5人からのいいねを追加
    const likeCount = Math.floor(Math.random() * 6);
    const likedUsers = new Set();
    for (let i = 0; i < likeCount; i++) {
      const liker = authors[Math.floor(Math.random() * authors.length)];
      if (!likedUsers.has(liker)) {
        likedUsers.add(liker);
        try {
          insertLike.run(postId, liker);
        } catch (e) {
          // 重複エラーは無視
        }
      }
    }
  });

  console.log('データベースを初期化しました');
}

export default db;
