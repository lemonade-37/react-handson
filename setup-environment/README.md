# 開発環境セットアップガイド

## 概要
このガイドでは、miseを使用したNode.js環境のセットアップから、ViteでReactプロジェクトを作成し、開発サーバーを起動するまでの一連の流れを説明します。

## 前提条件
- Windows 10/11 または macOS 10.15 以降
- 基本的なコマンドライン操作の知識
- インターネット接続

## 目次
1. [mise（ランタイム管理ツール）のインストール](#miseランタイム管理ツールのインストール)
2. [Node.jsのインストールと設定](#nodejsのインストールと設定)
3. [Viteを使用したReactプロジェクトの作成](#viteを使用したreactプロジェクトの作成)
4. [開発サーバーの起動と確認](#開発サーバーの起動と確認)
5. [トラブルシューティング](#トラブルシューティング)

## mise（ランタイム管理ツール）のインストール

### miseとは
mise（旧名rtx）は、複数のプログラミング言語のランタイム（Node.js、Python、Rubyなど）のバージョンを管理するツールです。従来のnvm、rbenv、pyenvなどを統一的に管理できる現代的なツールです。

**主な特徴:**
- 複数言語対応（Node.js、Python、Ruby、Go、Java等）
- 高速な起動とインストール
- `.tool-versions`ファイルによるプロジェクト単位の設定
- asdf互換性
- シェル統合による自動バージョン切り替え

### Windows でのインストール

#### 方法1: PowerShell（推奨）
管理者権限でPowerShellを開き、以下を実行：

```powershell
# Scoopパッケージマネージャーのインストール（未インストールの場合）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# miseのインストール
scoop bucket add main
scoop install mise
```

#### 方法2: Chocolatey
管理者権限でコマンドプロンプトまたはPowerShellを開き：

```cmd
# Chocolateyのインストール（未インストールの場合）
# PowerShellで実行
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# miseのインストール
choco install mise
```

#### 方法3: 手動インストール
1. [mise releases](https://github.com/jdx/mise/releases)から最新のWindows版バイナリをダウンロード
2. `mise.exe`を`C:\Program Files\mise\`に配置
3. システム環境変数PATHに`C:\Program Files\mise`を追加

### macOS でのインストール

#### 方法1: Homebrew（推奨）
```bash
# Homebrewのインストール（未インストールの場合）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# miseのインストール
brew install mise
```

#### 方法2: curl スクリプト
```bash
# 公式インストールスクリプトを使用
curl https://mise.jdx.dev/install.sh | sh

# パスの設定（~/.bashrc または ~/.zshrc に追加）
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 方法3: MacPorts
```bash
sudo port install mise
```

### シェル統合の設定

miseを効果的に使用するために、シェル統合を設定します：

#### Bash（Linux/macOS）
```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

#### Zsh（macOS デフォルト）
```bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

#### PowerShell（Windows）
```powershell
# PowerShellプロファイルファイルの場所を確認
$PROFILE

# プロファイルが存在しない場合は作成
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# プロファイルにmise設定を追加
Add-Content -Path $PROFILE -Value 'Invoke-Expression (&mise activate pwsh | Out-String)'

# プロファイルの再読み込み
. $PROFILE
```

#### Fish Shell
```bash
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
```

#### Git Bash（Windows）
```bash
# Git Bashプロファイルにmise設定を追加
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# プロファイルの再読み込み
source ~/.bashrc
```

### インストール確認

#### Linux/macOS
```bash
# バージョン確認
mise --version

# 利用可能な言語/ツールの確認
mise ls-remote

# Node.js の利用可能バージョン確認
mise ls-remote node
```

#### Windows (PowerShell)
```powershell
# バージョン確認
mise --version

# 利用可能な言語/ツールの確認 
mise ls-remote

# Node.js の利用可能バージョン確認
mise ls-remote node
```

## Node.jsのインストールと設定

### Node.jsバージョンの選択

**このプロジェクトではNode.js 22を使用します。**

Node.js 22は2024年4月にリリースされた最新のメジャーバージョンで、以下の特徴があります：

**Node.js 22の主な特徴:**
- V8 エンジン 12.4 による性能向上
- require() の ES modules サポート（実験的）
- Web Streams API の安定化
- improved performance hooks
- WebAssembly のコンパイル時最適化

#### Linux/macOS
```bash
# Node.js 22のインストール
mise install node@22

# 利用可能なNode.js 22のバージョン確認
mise ls-remote node | grep "^22\."```

#### Windows (PowerShell)
```powershell
# Node.js 22のインストール
mise install node@22

# 利用可能なNode.js 22のバージョン確認
mise ls-remote node | Select-String "^22\."```

#### Windows (Git Bash)
```bash
# Node.js 22のインストール
mise install node@22

# 利用可能なNode.js 22のバージョン確認
mise ls-remote node | grep "^22\."
```

### グローバル設定

#### Linux/macOS/Windows 共通
```bash
# システム全体でNode.js 22をデフォルトに設定
mise use --global node@22

# 設定確認
mise current
node --version  # v22.x.x が表示されることを確認
npm --version
```

**注意**: Windows環境では、PowerShellまたはGit Bashの使用を推奨します。

### プロジェクト固有の設定

**このプロジェクトルートには既に `.tool-versions` ファイルが配置されており、Node.js 22が指定されています。**

```bash
# プロジェクトディレクトリに移動
# Linux/macOS
cd /path/to/react-handson

# Windows (PowerShell/Git Bash)
cd C:/path/to/react-handson

# 自動的にNode.js 22が適用される（mise shell統合が有効な場合）
node --version  # v22.x.x が表示されることを確認

# 手動でプロジェクト用バージョンを設定する場合
mise use node@22

# .tool-versionsファイルの内容確認
cat .tool-versions
# 出力: node 22
```

### npmの設定とアップデート

```bash
# npmを最新版にアップデート
npm install -g npm@latest

# npmの設定確認
npm config list

# グローバルパッケージの保存場所確認
npm root -g

# npmキャッシュのクリア（問題がある場合）
npm cache clean --force
```

### yarn の代替設定（オプション）

```bash
# yarnの インストール（Corepack経由、推奨）
corepack enable
corepack prepare yarn@stable --activate

# または npm 経由
npm install -g yarn

# バージョン確認
yarn --version
```

## Viteを使用したReactプロジェクトの作成

### Viteとは

Vite（ヴィート）は、Evan You（Vue.jsの作者）が開発した高速なフロントエンド開発ツールです。

**技術的特徴:**
- **ES Modules**: 開発時にネイティブESモジュールを使用
- **esbuild**: Go製のトランスパイラーによる高速ビルド
- **Rollup**: 本番ビルドにRollupを使用
- **HMR（Hot Module Replacement）**: 高速なホットリロード
- **プラグインシステム**: Rollupプラグインとの互換性

### プロジェクトの作成

#### 基本的な作成方法

```bash
# Reactテンプレートでプロジェクト作成
npm create vite@latest my-react-app -- --template react

# または対話式での作成
npm create vite@latest my-react-app
# -> Select a framework: React
# -> Select a variant: JavaScript

# プロジェクトディレクトリに移動
cd my-react-app
```

#### TypeScript版の作成

```bash
# TypeScript + Reactテンプレート
npm create vite@latest my-react-app -- --template react-ts

# または
npm create vite@latest my-react-app
# -> Select a framework: React
# -> Select a variant: TypeScript
```

#### SWC版の作成（高速コンパイル）

```bash
# SWC（Speedy Web Compiler）を使用したReactプロジェクト
npm create vite@latest my-react-app -- --template react-swc

# TypeScript + SWC
npm create vite@latest my-react-app -- --template react-swc-ts
```

### 依存関係のインストール

```bash
# プロジェクトディレクトリに移動
cd my-react-app

# package.jsonに記載された依存関係をインストール
npm install

# または yarn を使用
yarn install
```

### プロジェクト構造の理解

作成されたプロジェクトの構造：

```
my-react-app/
├── public/
│   └── vite.svg              # 静的ファイル（ファビコンなど）
├── src/
│   ├── assets/
│   │   └── react.svg         # アセットファイル
│   ├── App.jsx              # メインAppコンポーネント
│   ├── App.css              # Appコンポーネントのスタイル
│   ├── index.css            # グローバルスタイル
│   └── main.jsx             # エントリーポイント
├── index.html               # HTMLテンプレート
├── package.json             # プロジェクト設定と依存関係
├── vite.config.js          # Vite設定ファイル
└── .gitignore              # Gitで無視するファイル設定
```

### 重要ファイルの詳細

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // 開発サーバーのポート
    open: true,        // ブラウザの自動起動
    host: true,        // ネットワーク経由でのアクセスを許可
  },
  build: {
    outDir: 'dist',    // ビルド出力ディレクトリ
    sourcemap: true,   // ソースマップの生成
  },
})
```

#### `package.json`
```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",              // 開発サーバー起動
    "build": "vite build",      // 本番ビルド
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"   // ビルド結果のプレビュー
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "vite": "^4.5.0"
  }
}
```

## 開発サーバーの起動と確認

### サーバーの起動

```bash
# 開発サーバーを起動
npm run dev

# または yarn の場合
yarn dev

# または直接viteコマンド
npx vite
```

### 起動時の表示

正常に起動すると、以下のような表示が出ます：

```
  VITE v4.5.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help
```

### ブラウザでの確認

1. ブラウザで `http://localhost:5173/` にアクセス
2. ReacとViteのロゴが表示されることを確認

### Hot Module Replacement（HMR）の確認

1. エディタで `src/App.jsx` を開く
2. テキストを変更して保存
3. ブラウザが自動的に更新されることを確認

### 開発サーバーの停止

```bash
# Ctrl+C （Windows/macOS/Linux）
# または Command+C （macOS）
```

## ビルドとプレビュー

### 本番ビルドの作成

```bash
# 最適化されたビルドを作成
npm run build

# dist/ ディレクトリにビルド結果が生成される
```

### ビルド結果のプレビュー

```bash
# ビルドしたファイルをローカルサーバーで確認
npm run preview

# ブラウザで http://localhost:4173/ にアクセス
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. miseコマンドが見つからない

**症状**: `mise: command not found`

**解決方法**:
```bash
# パスの確認
# Linux/macOS/Git Bash
echo $PATH

# Windows PowerShell
$env:PATH

# シェル設定の再読み込み
# macOS (zsh)
source ~/.zshrc

# Linux/Git Bash
source ~/.bashrc

# Windows PowerShell
. $PROFILE

# miseの再インストール
```

#### 2. Node.jsバージョンが切り替わらない

**症状**: `mise use node@20` 後も古いバージョンが使われる

**解決方法**:
```bash
# シェル統合が正しく設定されているか確認
mise doctor

# 手動でシェルを再起動
# Linux/macOS/Git Bash
exec $SHELL

# Windows PowerShell
powershell

# または新しいターミナルを開く
```

#### 3. npm installでエラーが発生

**症状**: パッケージインストール時にエラー

**解決方法**:
```bash
# npm キャッシュのクリア
npm cache clean --force

# node_modules と package-lock.json の削除
# Linux/macOS/Git Bash
rm -rf node_modules package-lock.json

# Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json

# 再インストール
npm install

# 権限エラーの場合（Windows）
npm install --no-optional
```

#### 4. ポート衝突エラー

**症状**: `Port 5173 is already in use`

**解決方法**:
```bash
# 別のポートで起動
npm run dev -- --port 3000

# または vite.config.js でポート設定
```

#### 5. Windows でのパス問題

**症状**: `'mise' is not recognized as an internal or external command`

**解決方法**:
```powershell
# システム環境変数の確認
$env:PATH

# PATHの区切り文字で分割して表示
$env:PATH -split ';'

# miseのパスを手動追加
$env:PATH += ";C:\Users\[ユーザー名]\.local\bin"

# 永続的な設定（システムプロパティから環境変数を設定）
```

### パフォーマンス最適化

#### 1. mise設定の最適化

```bash
# ~/.mise/config.toml を作成
[settings]
experimental = true
jobs = 8  # 並列ジョブ数（CPUコア数に応じて調整）
```

#### 2. npm設定の最適化

```bash
# レジストリ設定（日本の場合）
npm config set registry https://registry.npmjs.org/

# キャッシュディレクトリの設定
npm config set cache ~/.npm

# 並列インストール数の設定
npm config set maxsockets 50
```

#### 3. Vite設定の最適化

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: false  // シンボリックリンクの制限を緩和
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']  // 事前最適化対象
  }
})
```

## 次のステップ

### 開発環境の拡張

1. **ESLint・Prettier の設定**
   ```bash
   npm install -D eslint prettier eslint-config-prettier
   ```

2. **追加パッケージのインストール**
   ```bash
   # ルーティング
   npm install react-router-dom
   
   # UI ライブラリ
   npm install @mui/material
   
   # 状態管理
   npm install zustand
   ```

3. **VS Code 拡張機能**
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - Auto Rename Tag
   - Bracket Pair Colorizer

### 継続的な学習

1. **React基礎**
   - コンポーネント設計
   - Hooks（useState、useEffect）
   - イベントハンドリング

2. **モダンな開発手法**
   - TypeScript導入
   - テスト駆動開発（Jest、React Testing Library）
   - Git/GitHub でのバージョン管理

3. **デプロイメント**
   - Vercel、Netlify でのホスティング
   - GitHub Actions でのCI/CD

## 参考資料

- [mise公式ドキュメント](https://mise.jdx.dev/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [React公式ドキュメント](https://react.dev/)
- [Node.js公式サイト](https://nodejs.org/)
- [npm公式ドキュメント](https://docs.npmjs.com/)

---

このガイドに従って環境構築を行うことで、現代的なReact開発環境を構築できます。問題が発生した場合は、トラブルシューティングセクションを参照してください。