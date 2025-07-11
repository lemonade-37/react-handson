# （ゆる）React ハンズオン プロジェクト

## プロジェクト概要
このプロジェクトは（ゆる）React ハンズオンの教材です。
ソーシャルネットワーク（掲示板）アプリケーションを通じて、JavaScriptとReactの基本的な開発手法を学びます。
「（ゆる）」はexperimentalの意味で、実験的で気軽に取り組める内容を目指しています。

## 前提条件
- **Node.js 22** がインストールされていること（プロジェクトルートの `.tool-versions` ファイルで指定済み）
- mise または他のNode.jsバージョン管理ツールがインストールされていること
- 基本的なコマンドライン操作の知識
- 詳細な環境構築手順は [`setup-environment/README.md`](./setup-environment/README.md) を参照

## プロジェクト構造
- `setup-environment/` - 開発環境セットアップガイド
- `backend/` - 掲示板サービスのバックエンドAPI
- `vanilla-js/` - Vanilla JavaScriptハンズオン用プロジェクト（ハンズオン用）
- `vanilla-js-example/` - Vanilla JavaScriptの完成例
- `react-simple/` - React基本実装（ハンズオン用）
- `react-simple-example/` - Reactの完成例
- `.tool-versions` - Node.js 22バージョン固定設定

## 現在の状態
- `backend/` - 掲示板APIが実装済み（SQLite + Hono.js）
- `vanilla-js/` - ハンズオン用プロジェクト（詳細な実装ガイド付き）
- `vanilla-js-example/` - 完成したSNSアプリ（関数ベース実装）
- `react-simple/` - ハンズオン用プロジェクト（詳細な実装ガイド付き）
- `react-simple-example/` - 完成したReact SNSアプリ
- `react-powerful-example/` - React Server Components実装（**一時的にワークスペースから除外**）

### react-powerful-exampleについて
`react-powerful-example/`は@lazarv/react-serverを使ったReact Server Componentsプロジェクトです。
@lazarv/react-serverが独自のReactバージョンを含んでいるため、ワークスペース内の他のプロジェクトのReact 19.1.0と競合します。
そのため、一時的にワークスペース設定から除外して個別実行する必要があります。

実行方法：
```bash
cd react-powerful-example
npm run dev
```

## 開発スクリプト
- `npm run dev:backend` - バックエンドAPIサーバー
- `npm run dev:vanilla` - Vanilla JS版の開発サーバー（ハンズオン用）
- `npm run dev:vanilla-example` - Vanilla JS完成例の開発サーバー
- `npm run dev:simple` - React基本版の開発サーバー（ハンズオン用）
- `npm run dev:simple-example` - React完成例の開発サーバー

## ハンズオン実装ガイド

### 学習の進め方
両プロジェクトとも「**ダミーデータファーストアプローチ**」を採用しています：

1. **Step 1-6**: ダミーデータを使用してアプリケーションの基本機能を実装
2. **Step 7-9**: スタイリングとUX向上
3. **Step 10+**: API連携への移行（オプション）

### Vanilla JavaScript版 (`vanilla-js/`)
- **対象**: JavaScript の基本を学びたい方
- **学習内容**: 
  - DOM操作とイベント処理
  - モジュール化とコンポーネント設計
  - 状態管理パターン
  - イベント委譲
- **実装順序**: HTML構造 → DOM操作ユーティリティ → ダミーデータ → コンポーネント → 状態管理 → API連携

### React版 (`react-simple/`)
- **対象**: React の基本を学びたい方
- **学習内容**:
  - React Hooks (useState, useEffect)
  - コンポーネント設計
  - Props とイベントハンドリング
  - 状態管理
  - JSX とレンダリング
- **実装順序**: 環境構築 → ダミーデータ → コンポーネント → 状態管理 → ページネーション → API連携

### 共通機能
- 投稿の作成・表示・削除
- いいね機能
- コメント機能（モーダル）
- ページネーション
- レスポンシブデザイン
- ダークモード対応

## 技術スタック

### バックエンド
- **Runtime**: Node.js 22
- **Framework**: Hono.js
- **Database**: SQLite
- **API**: RESTful API

### フロントエンド
- **Vanilla JS版**: 
  - Build Tool: Vite
  - Language: Modern JavaScript (ES6+)
  - Styling: CSS with Custom Properties
- **React版**:
  - Build Tool: Vite
  - Framework: React 19
  - Language: JSX
  - Styling: CSS with Custom Properties

## 学習のポイント

### 段階的な学習設計
1. **基本機能の実装**: ダミーデータで動作確認
2. **UX向上**: スタイリングとエラーハンドリング
3. **API連携**: 実際のサーバーとの通信

### 実践的なスキル習得
- **状態管理**: アプリケーションの状態を適切に管理
- **コンポーネント設計**: 再利用可能なコンポーネントの作成
- **エラーハンドリング**: 適切なエラー処理とユーザーフィードバック
- **レスポンシブデザイン**: 様々なデバイスに対応したUI

## 次のステップ
- TypeScript版の実装
- 状態管理ライブラリの導入（Redux、Zustand）
- テストの追加（Jest、React Testing Library）
- PWA対応
- WebSocket を使用したリアルタイム機能

## 備忘録
- バックエンドAPIを更新したら、他のプロジェクトにも同様の変更を反映させてください