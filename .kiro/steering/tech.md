# 技術スタック

## アーキテクチャ

Next.js App Routerベースのフルスタックアプリケーション。フロントエンドとAPI Route（バックエンド）を単一プロジェクトで管理し、ドメインロジックは`packages/`に分離。

## コア技術

- **言語**: TypeScript（strict mode）
- **フレームワーク**: Next.js 16（App Router）
- **UI**: React 19 + Tailwind CSS 4
- **ORM**: Prisma 6（PostgreSQL）
- **ランタイム**: Node.js

## 主要ライブラリ

- **Prisma Client**: DB操作（Prismaで生成されたクライアントは`app/generated/prisma/`に配置）
- **GitHub GraphQL API**: 外部API連携（スキル分析用）
- **AES-256-GCM暗号化**: GitHubトークンの安全な保管

## 開発標準

### 型安全性
TypeScript strict mode有効。`@/*`パスエイリアスでプロジェクトルートからの絶対パスインポート。

### コード品質
ESLint（eslint-config-next）によるリンティング。

### テスト
Unit:Jest
E2Eテスト:Cypress

## 開発環境

### 必須ツール
- pnpm（パッケージマネージャー）
- Docker（PostgreSQLコンテナ）

### 主要コマンド
```bash
# 開発: pnpm dev
# ビルド: pnpm build
# リント: pnpm lint
# DB生成: pnpm db:generate
# DBマイグレーション: pnpm db:migrate
# DBシード: pnpm db:seed
```

## 主要な技術判断

- **App Router採用**: Server Components / Client Componentsの分離によるパフォーマンス最適化
- **packages/による分離**: ドメインロジック（`server-core`）をフレームワーク非依存に保つ
- **暗号化トークン管理**: `.env.key`ファイルとAES-256-GCMによるGitHubトークンの安全な管理

---
_標準とパターンを文書化し、すべての依存関係ではない_
