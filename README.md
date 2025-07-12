# （ゆる）React ハンズオン

> 実験的で気軽に取り組める React 学習プロジェクト

## 🚀 クイックスタート（経験者向け）

**すぐに始めたい方は以下のコマンドを実行してください：**

```bash
# 1. 依存関係のインストール
npm install

# 2. バックエンドサーバーの起動（別ターミナル）
npm run dev:backend

# 3. フロントエンドサーバーの起動（お好みで）
npm run dev:simple         # React基本版
npm run dev:simple-example  # React完成例
npm run dev:vanilla         # Vanilla JS版
npm run dev:vanilla-example # Vanilla JS完成例
```

ブラウザで `http://localhost:3000` にアクセスしてください。

---

## 📋 プロジェクト概要

このプロジェクトは、ソーシャルネットワーク（掲示板）アプリケーションを通じて、**JavaScript** と **React** の基本的な開発手法を学ぶためのハンズオン教材です。

### 主な機能
- 📝 投稿の作成・表示・削除
- 👍 いいね機能
- 💬 コメント機能（モーダル）
- 📄 ページネーション
- 📱 レスポンシブデザイン
- 🌙 ダークモード対応

### バックエンドサービスについて
- **技術スタック**: Node.js 22 + Hono.js + SQLite
- **API仕様**: RESTful API
- **ポート**: http://localhost:9999
- **データベース**: SQLite（`backend/database.sqlite`）
- **機能**: 投稿CRUD、いいね機能、コメント機能

## 📁 フォルダ構成

```
react-handson/
├── README.md                    # このファイル
├── CLAUDE.md                   # プロジェクト詳細情報
├── package.json                # ワークスペース設定
├── .tool-versions              # Node.js 22バージョン固定
├── slides/                     # ハンズオン用スライド
│   └── web-development-evolution.md
├── setup-environment/          # 開発環境構築ガイド
│   └── README.md
├── backend/                    # バックエンドAPI（Hono.js + SQLite）
│   ├── src/
│   ├── package.json
│   └── database.sqlite
├── vanilla-js/                 # Vanilla JS ハンズオン用
│   ├── src/
│   ├── package.json
│   └── README.md              # 詳細な実装ガイド
├── vanilla-js-example/         # Vanilla JS 完成例
│   ├── src/
│   └── package.json
├── react-simple/               # React 基本ハンズオン用
│   ├── src/
│   ├── package.json
│   └── README.md              # 詳細な実装ガイド
├── react-simple-example/       # React 基本完成例
│   ├── src/
│   └── package.json
├── react-powerful/             # React 19 ハンズオン用
│   ├── src/
│   ├── package.json
│   └── README.md              # 詳細な実装ガイド
└── react-powerful-example/     # React 19 実験版（不安定）
    ├── src/
    └── package.json
```

## 🛠️ 開発環境のセットアップ

### 前提条件
- **Git** がインストールされていること
- **Node.js 22** がインストールされていること
- **npm** または **yarn** がインストールされていること
- **VSCode** （推奨）

### Git のインストール

#### Windows
1. **Git for Windows** をダウンロード
   - https://git-scm.com/download/win
   - インストーラーを実行してデフォルト設定でインストール

2. **確認方法**
   ```bash
   git --version
   ```

#### macOS
1. **Homebrew を使用**（推奨）
   ```bash
   # Homebrew のインストール（未インストールの場合）
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Git のインストール
   brew install git
   ```

2. **または Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

3. **確認方法**
   ```bash
   git --version
   ```

### 環境構築が正常にできているか確認
```bash
# 1. リポジトリをクローン
git clone https://github.com/WataruNishimura/react-handson.git
cd react-handson

# 2. Node.js 22 を使用（mise使用の場合）
mise install

# 3. 依存関係をインストール
npm install

# 4. バックエンドサーバーを起動
npm run dev:backend
```

### 利用可能なコマンド（覚えておいてください）
```bash
# バックエンド
npm run dev:backend         # APIサーバー起動

# フロントエンド（ハンズオン用）
npm run dev:vanilla         # Vanilla JS版
npm run dev:simple          # React基本版

# フロントエンド（完成例）
npm run dev:vanilla-example # Vanilla JS完成例
npm run dev:simple-example  # React完成例

# React 19 (個別実行が必要)
cd react-powerful && npm run dev        # React 19 ハンズオン用
cd react-powerful-example && npm run dev # React 19 完成例
```

## 📚 学習の進め方

### 1. ダミーデータファーストアプローチ
各プロジェクトは以下の段階で進めます：
1. **Step 1-6**: ダミーデータを使用した基本機能実装
2. **Step 7-9**: スタイリングとUX向上
3. **Step 10+**: API連携への移行

### 2. 段階的な学習設計
- **基本機能の実装**: ダミーデータで動作確認
- **UX向上**: スタイリングとエラーハンドリング
- **API連携**: 実際のサーバーとの通信

### 3. 実践的なスキル習得
- **状態管理**: アプリケーション状態の適切な管理
- **コンポーネント設計**: 再利用可能なコンポーネント作成
- **エラーハンドリング**: 適切なエラー処理とユーザーフィードバック

## 🎮 VSCode でのターミナル操作

### ターミナルを開く方法
1. VSCode を起動
2. `Ctrl + Shift + ` （バッククォート）または `View > Terminal`
3. 以下のコマンドを実行：

```bash
# プロジェクトルートに移動
cd react-handson

# 依存関係をインストール
npm install

# バックエンドサーバーを起動（新しいターミナル）
npm run dev:backend

# フロントエンドサーバーを起動（新しいターミナル）
npm run dev:simple
```

### 複数ターミナルの使い方
- `Ctrl + Shift + ` で新しいターミナルを作成
- バックエンドとフロントエンドを同時に起動するため、2つのターミナルが必要です


## 🎯 学習パス

あなたの目標に合わせて選んでください：

### 🔧 開発環境から始めたい方
**[setup-environment/](./setup-environment/)** から始めてください
- Node.js 22 のインストール
- mise によるバージョン管理
- Vite プロジェクトの作成
- 基本的なコマンドライン操作

### ⚛️ React をシンプルに初めて触る方
**[react-simple/](./react-simple/)** から始めてください
- React Hooks (useState, useEffect)
- コンポーネント設計
- Props とイベントハンドリング
- 状態管理の基本
- **完成例**: [react-simple-example/](./react-simple-example/)

### 🚀 React 19 の新機能を触りたい方
**[react-powerful/](./react-powerful/)** から始めてください
- React Server Components
- useOptimistic による楽観的更新
- Server Actions
- ⚠️ **注意**: 非常に不安定です
- 実験的な機能のため、エラーが発生する可能性があります
- **完成例**: [react-powerful-example/](./react-powerful-example/)

### 📝 JavaScript だけで試してみたい方
**[vanilla-js/](./vanilla-js/)** から始めてください
- DOM操作とイベント処理
- モジュール化とコンポーネント設計
- 状態管理パターン
- **完成例**: [vanilla-js-example/](./vanilla-js-example/)

## 🎯 次のステップ

ハンズオンを完了したら、以下にチャレンジしてみてください：

- **TypeScript版**の実装
- **状態管理ライブラリ**の導入（Redux、Zustand）
- **テストの追加**（Jest、React Testing Library）
- **PWA対応**
- **WebSocket**を使用したリアルタイム機能

## 🤝 コントリビューション

このプロジェクトは実験的な取り組みです。改善提案や問題報告をお待ちしています。

## 📖 参考資料

- [React 公式ドキュメント](https://react.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Vite 公式ドキュメント](https://vitejs.dev/)
- [Hono 公式ドキュメント](https://hono.dev/)

---

**Happy Coding! 🎉**

> 「（ゆる）」は experimental の意味で、実験的で気軽に取り組める内容を目指しています。