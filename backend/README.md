# 掲示板API

SQLiteとHono.jsを使用したシンプルな掲示板APIサーバーです。

## 起動方法

```bash
npm install
npm run dev
```

サーバーは http://localhost:9999 で起動します。

## API エンドポイント

### 投稿（Posts）

#### GET /api/posts

全ての投稿を取得します。コメント数といいね数も含まれます。

#### GET /api/posts/:id

特定の投稿を詳細情報（コメント含む）と共に取得します。

#### POST /api/posts

新しい投稿を作成します。

リクエストボディ:

```json
{
  "author": "投稿者名",
  "content": "投稿内容"
}
```

#### DELETE /api/posts/:id

投稿を削除します。

### コメント（Comments）

#### POST /api/posts/:id/comments

投稿にコメントを追加します。

リクエストボディ:

```json
{
  "author": "コメント者名",
  "content": "コメント内容"
}
```

### いいね（Likes）

#### POST /api/posts/:id/likes

投稿にいいねを追加します。

リクエストボディ:

```json
{
  "userId": "ユーザーID"
}
```

#### DELETE /api/posts/:id/likes

投稿のいいねを削除します。

リクエストボディ:

```json
{
  "userId": "ユーザーID"
}
```

## データベース構造

- `posts` - 投稿
- `comments` - コメント
- `likes` - いいね

初回起動時に自動的にデータベースが作成され、サンプルデータが挿入されます。
