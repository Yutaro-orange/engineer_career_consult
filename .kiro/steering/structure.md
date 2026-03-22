# プロジェクト構造

## 構成方針

4層レイヤードアーキテクチャ。Next.js App Routerの規約に従いつつ、ドメインロジックを`packages/`に分離して再利用性を確保。

## ディレクトリパターン

### ページ・ルーティング
**場所**: `app/`
**目的**: Next.js App Routerの規約に従ったページ定義
**例**: `app/consult/page.tsx`（診断ページ）、`app/menu/page.tsx`（メニュー画面）

### UIコンポーネント
**場所**: `app/components/`
**目的**: ページから利用される再利用可能なUIコンポーネント
**例**: `ConsultContent.tsx`（診断フロー）、`Menu.tsx`（メニュー表示）

### APIルート
**場所**: `app/api/`
**目的**: Next.js Route Handlersによるバックエンドエンドポイント
**例**: `app/api/diagnosis/analyze/route.ts`

### ユースケース層
**場所**: `app/application/use-cases/`
**目的**: ビジネスロジックのオーケストレーション
**例**: `skillsUseCases.ts`（GitHubスキル取得のユースケース）

### ドメイン層（パッケージ分離）
**場所**: `packages/server-core/domain/`
**目的**: フレームワーク非依存のドメインロジック・型定義
**例**: `skillResult.ts`（GitHub APIの型定義と取得関数）

### ユーティリティ（パッケージ分離）
**場所**: `packages/server-core/utilities/`
**目的**: 汎用ユーティリティ関数
**例**: `encryption.ts`（AES-256-GCM暗号化）

### 共有ライブラリ
**場所**: `lib/`
**目的**: アプリケーション固有の共有ロジック
**例**: `lib/diagnosis/`（診断ロジック・質問データ）、`lib/prisma.ts`（Prismaクライアント初期化）

### スクリプト
**場所**: `scripts/`
**目的**: 開発用CLIスクリプト
**例**: `encrypt-token.ts`（トークン暗号化ツール）

## 命名規約

- **ファイル**: コンポーネントはPascalCase（`ConsultContent.tsx`）、その他はcamelCase（`skillResult.ts`）
- **コンポーネント**: PascalCase（`Menu`, `Chat`）
- **関数**: camelCase（`getQuestions`, `analyzeAnswers`）
- **型**: PascalCase（`GitHubRepository`, `SkillSummary`）

## インポート規約

```typescript
// パスエイリアスによる絶対パスインポート
import { getQuestions } from "@/lib/diagnosis/questions";
import { ConsultContent } from "@/app/components/ConsultContent";
import { getSkillResult } from "@/packages/server-core/domain/skillResult";

// 相対インポートは同一ディレクトリ内に限定
import { Local } from "./local";
```

**パスエイリアス**:
- `@/`: プロジェクトルート（`./`にマッピング）

## コード構成原則

- Server Components（デフォルト）とClient Components（`"use client"`宣言）を明確に分離
- ページコンポーネントはデータ取得のみ行い、表示ロジックはコンポーネントに委譲
- ドメインロジックはNext.jsに依存しない`packages/`に配置
- Prisma生成コードは`app/generated/prisma/`に自動配置

---
_パターンを文書化し、ファイルツリーではない。パターンに従う新しいファイルは更新不要_
