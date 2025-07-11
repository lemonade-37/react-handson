---
marp: true
theme: default
class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
---

# （ゆる）React ハンズオン
## Web開発の進化：ブラウザ・JavaScript・Reactの歴史

---

# 今日の内容

1. **Webアプリケーションの仕組み**
   - ブラウザとJavaScript
   - fetchとバックエンド
   - データベースとの関係
   - Reactの立ち位置

2. **JavaScript開発の流れ**
   - DOM操作中心の開発
   - jQuery時代
   - パラダイムシフト
   - 現代的な開発手法
   
---

# お断り

- 今回のハンズオンは（ゆる）＝ experimentalな取り組みです
- 今後のhokkaio.jsで何回かやっていこうとしていますが、果たしでどこまで続くのか...
- macOS向けにはある程度動作することを確認していますが、Windows向けには微妙な可能性があります
- Claude Codeと一緒に3日間くらいかけて作っています

---

# このハンズオンの構成

- 解説パート（このスライド）
- ハンズオンパート（できるところまでやります）

---

# ターゲット（ゆる Ver.）
- JavaScriptを書いたことが一度でもある人
- Webアプリケーションを開発したことがある人


---

# Part 1: Webアプリケーションの仕組み

---

## Webアプリケーションの基本構成

<div style="display: flex;">

<pre class="mermaid" style="font-size: 24px;">
graph TD
  A[ブラウザ<br/> Frontend] <-->|HTML/CSS/JavaScript| B[バックエンド<br/>Server]
  B --> C[データベース<br/>DB]
    
  style A fill:#e1f5fe,color:#000000,font-size:24px
  style B fill:#f3e5f5,color:#000000,font-size:24px
  style C fill:#e8f5e8,color:#000000,font-size:24px
</pre>


<div style="flex: 2; margin-left: 60px;">

### 解説

- ブラウザ＝アプリケーションの画面部分を構築している
- HTML/CSS/JavaScript＝バックエンドとやり取りされるプログラム（実態はテキストデータ）
- バックエンド＝実際の機能面の実装（CRUD）や、データベース（データ保存先）とのやり取りをしている
- データベース＝色々なデータがここに含まれている


</div>


</div>



---

## ブラウザの役割をもっと細かく解説

ブラウザはその内部にあるレンダリングエンジンを利用し、サーバーから返却してもらったプログラムを計算し画面を構成しています

### **レンダリングエンジン**
- HTML、CSS、JavaScriptの解釈・計算
  - HTML、CSS、JavaScript = 画面を構築するのに必要なプログラム
- DOM（Document Object Model）の構築
  - 画面の要素（ボックスやボタン）はDOMという木構造で管理されている
- 画面の構成や見た目の更新を行なっている


---

## ブラウザの役割をもっと細かく解説

それ以外にも様々なWeb APIと呼ばれる機能を持ち、お手持ちのPCにある機能をそれはふんだんに利用しています

### **様々なWeb API**
- USBデバイスとの接続、Bluetoothの通信
- WebGLやWebGPUといった3DCG等の高度な映像描画
- fetch APIを利用したHTTP通信

---

## ブラウザ以外でも動くJavaScript

JavaScriptは基本的にはWebブラウザ上でのみ動くプログラミング言語です
ですが、近年PythonやRubyのようにお手元のPCで動くJavaScriptもあったりします

### **ブラウザのJavaScript**
- V8エンジン（Chrome）、SpiderMonkey（Firefox）
- ECMAScript標準の実装
- Web API の提供（fetch、DOM操作、イベントなど）


### **手元のPCで実行できるJavaScript**
- Node.js（今回のデモバックエンドはこれを使っています）
- Deno

---

## JavaScriptとブラウザ

### **DOM操作**
```javascript
// HTML要素の取得と操作
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  document.body.style.backgroundColor = 'blue';
});
```

### **イベント処理**
- ユーザーインタラクション（クリック、入力）
- 非同期処理（タイマー、ネットワーク）
- ブラウザイベント（ページロード、リサイズ）

---

## fetchとバックエンド通信

### **HTTP通信の仕組み**
```javascript
// サーバーからデータを取得
fetch('/api/posts')
  .then(response => response.json())
  .then(posts => {
    // 取得したデータでUIを更新
    displayPosts(posts);
  });
```

---

## バックエンドとデータベースの関係

### **サーバーサイドの処理フロー**

<pre class="mermaid" style="font-size: 24px;">
flowchart LR
    A[1\. リクエスト受信<br/>HTTP Request<br/>ブラウザから] --> B[2\. ビジネスロジック<br/>データ検証・変換<br/>認証・認可]
    B --> C[3\. DB操作<br/>SQL実行<br/>INSERT/SELECT]
    C --> D[4\. レスポンス返却<br/>JSON Response<br/>ブラウザへ]
    
    style A fill:#ffebee,color:#000000,font-size:24px
    style B fill:#f3e5f5,color:#000000,font-size:24px
    style C fill:#e8f5e8,color:#000000,font-size:24px
    style D fill:#e3f2fd,color:#000000,font-size:24px
</pre>

### **データの永続化**
- リレーショナルDB（MySQL、PostgreSQL）
- NoSQL（MongoDB、Firebase）
- ファイルシステム、クラウドストレージ

---

## ReactのWebアプリケーション開発での立ち位置

### **フロントエンド開発フレームワーク**

<pre class="mermaid" style="font-size: 20px;flex: 1;">
graph TD
    A[ブラウザ] --> B[React<br/>フレームワーク]
    B --> C[バックエンド<br/>API]
    C --> D[データベース]
    
    B --> E[コンポーネント<br/>管理]
    B --> F[状態管理]
    B --> G[UI更新]
    
    style A fill:#e1f5fe,color:#000000,font-size:20px
    style B fill:#ffcdd2,color:#000000,font-size:20px
    style C fill:#f3e5f5,color:#000000,font-size:20px
    style D fill:#e8f5e8,color:#000000,font-size:20px
    style E fill:#fff3e0,color:#000000,font-size:20px
    style F fill:#fff3e0,color:#000000,font-size:20px
    style G fill:#fff3e0,color:#000000,font-size:20px
</pre>


---

## ReactのWebアプリケーション開発での立ち位置

### **フロントエンド開発フレームワーク**

- **ブラウザとバックエンドの橋渡し**
  - ユーザーの操作を受け取り
  - APIを通じてデータを取得・更新
  - 取得したデータを画面に表示

- **フロントエンド開発の効率化**
  - コンポーネント化による再利用性
  - 宣言的なUI記述
  - 状態管理の標準化


---

## ReactがWebアプリケーション開発に与える影響

### **開発効率の向上**
- **コンポーネント再利用**: 一度作ったUI部品を複数箇所で使用
- **宣言的記述**: 「何を表示するか」を記述するだけ
- **状態管理**: データの変更が自動的にUIに反映

### **チーム開発の標準化**
- **明確な設計パターン**: コンポーネント設計の標準化
- **エコシステム**: 豊富なライブラリとツール
- **開発者体験**: 効率的なデバッグとテスト

---

## ReactのWebアプリケーション開発での立ち位置

### **WebアプリケーションのUX向上**
- **高速なUI更新**: 仮想DOMによる効率的な画面更新
- **レスポンシブな操作感**: リアルタイムなユーザーインタラクション
- **モダンなUI**: 現代的なWebアプリケーションの実現

---

# Part 2: JavaScript開発の流れ

---

## Web 1.0時代（1990年代後半）

### **静的なWebページ**
- HTML + CSS のみ
- ユーザーインタラクションは限定的
- ページ遷移でサーバーにリクエスト

```html
<!-- 典型的なWeb 1.0 -->
<form action="/submit" method="POST">
  <input type="text" name="username">
  <input type="submit" value="送信">
</form>
```

**問題点**: ページ全体のリロードが必要

---

## JavaScript登場（1995年〜）

### **動的な要素の追加**
```javascript
// フォームバリデーション
function validateForm() {
  const username = document.forms["myForm"]["username"].value;
  if (username == "") {
    alert("ユーザー名を入力してください");
    return false;
  }
  return true;
}
```

---

## JavaScript登場（1995年〜）


### **初期のJavaScriptの用途**
- フォームバリデーション
- 画像のロールオーバー効果
- 簡単なアニメーション
- ポップアップウィンドウ

---

## AJAX革命（2005年〜）

### **Asynchronous JavaScript and XML**
```javascript
// XMLHttpRequest（AJAX の原型）
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    document.getElementById('content').innerHTML = xhr.responseText;
  }
};
xhr.send();
```

---

## AJAX革命（2005年〜）

### **パラダイムシフト**
- **ページリロードなし**でデータ更新
- **リッチインターネットアプリケーション**（RIA）の実現
- Gmail、Google Maps の登場

---

## jQuery時代（2006年〜2010年代）

### **DOM操作の簡素化**
```javascript
// Vanilla JavaScript
document.getElementById('myButton').addEventListener('click', function() {
  document.querySelectorAll('.item').forEach(function(element) {
    element.style.display = 'none';
  });
});

// jQuery
$('#myButton').click(function() {
  $('.item').hide();
});
```

---

## jQuery時代（2006年〜2010年代）

### **jQueryの貢献**
- **ブラウザ互換性**の解決
- **簡潔なAPI**でDOM操作
- **プラグインエコシステム**の確立

---

## 従来JavaScript開発の特徴

### **手続き型プログラミング**
```javascript
// イベント駆動型の開発
$(document).ready(function() {
  $('#addButton').click(function() {
    const newItem = $('#inputField').val();
    $('#itemList').append('<li>' + newItem + '</li>');
    $('#inputField').val('');
  });
  
  $('.deleteButton').click(function() {
    $(this).parent().remove();
  });
});
```

---

## 従来JavaScript開発の特徴

### **課題**
- **状態管理**が困難
- **DOM操作の散在**
- **コードの再利用性**が低い
- **大規模アプリケーション**での保守性

---

## React以前の課題

### **複雑な状態管理**
```javascript
// 従来の方法：状態が分散
let userName = '';
let userEmail = '';
let isLoggedIn = false;

function updateUserInfo() {
  $('#userName').text(userName);
  $('#userEmail').text(userEmail);
  if (isLoggedIn) {
    $('#loginButton').hide();
    $('#logoutButton').show();
  }
  // ... 無数のDOM操作
}
```

---

## Reactの革命的なアイデア

### **宣言的UI**
```jsx
// Reactの方法：状態に基づくUI描画
function UserProfile({ user, isLoggedIn }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {isLoggedIn ? (
        <button onClick={logout}>ログアウト</button>
      ) : (
        <button onClick={login}>ログイン</button>
      )}
    </div>
  );
}
```

### **キーコンセプト**
- **Component指向**: UIを独立したパーツとして設計
- **単方向データフロー**: データの流れが明確
- **仮想DOM**: 効率的な画面更新

---

## コンポーネント指向開発

### **再利用可能なUI部品**
```jsx
// Button コンポーネント
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## コンポーネント指向開発

```jsx
// 使用例
<Button onClick={handleSave} variant="success">
  保存
</Button>
<Button onClick={handleCancel} variant="secondary">
  キャンセル
</Button>
```

---

## 状態管理の進化

### **useState Hook**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増加
      </button>
    </div>
  );
}
```

---

## 状態管理の進化

### **従来との比較**
- ❌ DOM要素を直接操作
- ✅ 状態の変更でUIが自動更新
- ❌ グローバル変数で状態管理
- ✅ コンポーネント内で状態を管理

---

## エコシステムの発展

### **開発ツールの進歩**
- **Create React App**: 簡単なプロジェクト作成
- **JSX**: JavaScript内にHTMLライクな記法
- **Hot Reload**: リアルタイムプレビュー
- **Component DevTools**: デバッグツール

### **周辺ライブラリ**
- **React Router**: SPA routing
- **Redux/Zustand**: グローバル状態管理
- **Styled Components**: CSS-in-JS
- **Next.js**: フルスタックフレームワーク

---

## 開発パラダイムの変化

### **Before React: 命令的プログラミング**
```javascript
// 「どうやって」実現するかを記述
function addTodo(text) {
  const li = document.createElement('li');
  li.textContent = text;
  li.addEventListener('click', function() {
    this.classList.toggle('completed');
  });
  document.getElementById('todoList').appendChild(li);
}
```

---

## 開発パラダイムの変化

### **After React: 宣言的プログラミング**
```jsx
// 「何を」表示するかを記述
function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <li 
          key={todo.id}
          className={todo.completed ? 'completed' : ''}
          onClick={() => onToggle(todo.id)}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

---

## Reactの影響とその後

### **フロントエンド開発の標準化**
- **コンポーネント思考**が主流に
- **状態管理**パターンの確立
- **TypeScript**との相性
- **関数型プログラミング**要素の導入

### **他フレームワークへの影響**
- **Vue.js**: 類似のコンポーネントシステム
- **Angular**: React的な要素の取り入れ
- **Svelte**: コンパイル時最適化
- **Flutter**: モバイル開発での類似思想

---

## 現代のフロントエンド開発

### **開発体験の向上**
```jsx
// 型安全性（TypeScript）
interface User {
  id: number;
  name: string;
  email: string;
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```
---

## 現代のフロントエンド開発

### **ビルドツールの役割**

<pre class="mermaid" style="font-size: 18px;">
graph TD
    A[開発者が書くコード<br/>JSX/TypeScript/CSS] --> B[ビルドツール<br/>Vite/Webpack]
    B --> C[ブラウザで実行可能<br/>JavaScript/HTML/CSS]
    C --> D[ブラウザ<br/>実行環境]
    
    B --> E[コード変換<br/>Transpile]
    B --> F[バンドル<br/>Bundle]
    B --> G[最適化<br/>Minify]
    
    style A fill:#e3f2fd,color:#000000,font-size:18px
    style B fill:#ffcdd2,color:#000000,font-size:18px
    style C fill:#e8f5e8,color:#000000,font-size:18px
    style D fill:#f3e5f5,color:#000000,font-size:18px
    style E fill:#fff3e0,color:#000000,font-size:18px
    style F fill:#fff3e0,color:#000000,font-size:18px
    style G fill:#fff3e0,color:#000000,font-size:18px
</pre>


---

## 現代のフロントエンド開発

### **ビルドツールの機能**

- **JSX → JavaScript変換**
  - React のJSX記法をブラウザが理解できるJavaScriptに変換
- **モジュールバンドル**
  - 複数ファイルを1つにまとめる
- **コード最適化**
  - 不要なコードの削除、圧縮
- **開発サーバー**
  - Hot Reload による即座の更新

---

## ビルドツールとサーバーサイドJSの関係

### **Node.js エコシステム**

<pre class="mermaid" style="font-size: 18px;">
graph TD
    A[Node.js<br/>JavaScript Runtime] --> B[ビルドツール<br/>Vite/Webpack]
    A --> C[バックエンド<br/>API Server]
    A --> D[パッケージ管理<br/>npm/yarn]
    
    B --> E[フロントエンド<br/>開発環境]
    C --> F[サーバー<br/>実行環境]
    D --> G[依存関係<br/>管理]
    
    style A fill:#e8f5e8,color:#000000,font-size:18px
    style B fill:#ffcdd2,color:#000000,font-size:18px
    style C fill:#f3e5f5,color:#000000,font-size:18px
    style D fill:#e3f2fd,color:#000000,font-size:18px
    style E fill:#fff3e0,color:#000000,font-size:18px
    style F fill:#fff3e0,color:#000000,font-size:18px
    style G fill:#fff3e0,color:#000000,font-size:18px
</pre>


---

## ビルドツールとサーバーサイドJSの関係

### **統一された開発環境**
- **同じ言語（JavaScript）** でフロントエンド・バックエンド・ツールを開発
- **npm エコシステム**による豊富なライブラリ
- **開発者体験の統一**：同じ構文、同じツールチェーン

---

## モダンな開発ツールの実例

### **Vite（今回使用するビルドツール）**
```javascript
// 開発中に書くコード（JSX）
function App() {
  return <div>Hello React!</div>;
}

// ↓ Viteが自動変換 ↓

// ブラウザで実行されるコード
function App() {
  return React.createElement("div", null, "Hello React!");
}
```

---

## モダンな開発ツールの実例

### **その他のモダンツール**
- **ESLint/Prettier**: コード品質管理
- **Jest/Testing Library**: テスト自動化

---

## 開発フローの進化

### **従来の開発フロー**
```
HTML書く → CSS書く → JavaScript書く → ブラウザで確認 → 修正 → 再読み込み
```

### **現代の開発フロー**
```
JSX/TypeScript書く → Vite が自動変換 → Hot Reload で即座に反映 → デバッグ
```

### **開発効率の向上**
- **リアルタイムプレビュー**: コード変更が即座に画面に反映
- **型安全性**: TypeScript による開発時エラー検出
- **自動フォーマット**: Prettier による統一されたコードスタイル

---

# というわけでハンズオンをやっていきます