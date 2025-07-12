// ダミーデータの管理
let nextId = 4;

export const dummyPosts = [
  {
    id: 1,
    author: 'Alice',
    content: 'こんにちは！今日はいい天気ですね。',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    like_count: 3,
    comment_count: 2,
    comments: [
      {
        id: 1,
        author: 'Bob',
        content: 'そうですね！散歩日和です。',
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 2,
        author: 'Charlie',
        content: '私も外に出かけたいです。',
        created_at: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    author: 'Bob',
    content: 'Reactの勉強をしています。難しいですが楽しいです！',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2時間前
    like_count: 5,
    comment_count: 1,
    comments: [
      {
        id: 3,
        author: 'Alice',
        content: 'がんばって！応援してます。',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 3,
    author: 'Charlie',
    content: 'みなさんこんばんは！今日も一日お疲れ様でした。',
    created_at: new Date(Date.now() - 10800000).toISOString(), // 3時間前
    like_count: 2,
    comment_count: 0,
    comments: [],
  },
];

export function addPost(author, content) {
  const newPost = {
    id: nextId++,
    author,
    content,
    created_at: new Date().toISOString(),
    like_count: 0,
    comment_count: 0,
    comments: [],
  };
  dummyPosts.unshift(newPost);
  return newPost;
}

export function deletePost(postId) {
  const index = dummyPosts.findIndex(post => post.id === parseInt(postId));
  if (index !== -1) {
    dummyPosts.splice(index, 1);
    return true;
  }
  return false;
}

export function toggleLike(postId, increment = true) {
  const post = dummyPosts.find(post => post.id === parseInt(postId));
  if (post) {
    post.like_count += increment ? 1 : -1;
    post.like_count = Math.max(0, post.like_count);
  }
}

export function addComment(postId, author, content) {
  const post = dummyPosts.find(post => post.id === parseInt(postId));
  if (post) {
    const newComment = {
      id: Date.now(),
      author,
      content,
      created_at: new Date().toISOString(),
    };
    post.comments.push(newComment);
    post.comment_count = post.comments.length;
    return newComment;
  }
  return null;
}

export function getPaginatedPosts(page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = dummyPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      totalCount: dummyPosts.length,
      totalPages: Math.ceil(dummyPosts.length / limit),
      hasNext: endIndex < dummyPosts.length,
      hasPrev: page > 1,
    },
  };
}

export function getPostById(postId) {
  return dummyPosts.find(post => post.id === parseInt(postId));
}
