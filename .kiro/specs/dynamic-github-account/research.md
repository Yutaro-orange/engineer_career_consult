# リサーチログ: dynamic-github-account

## サマリー

GitHub OAuthによる動的アカウント機能の設計調査。Auth.js（NextAuth.js v5）+ Prisma Adapter + JWT戦略の採用を決定。既存のスキル分析基盤は再利用可能で、主に認証レイヤーの新規追加とGitHub APIクライアントのパラメータ化が必要。

---

## リサーチログ

### Topic 1: Auth.js v5 + Next.js 16 互換性

**ソース**: Auth.js公式ドキュメント、npm、GitHub Issue #13302

**調査結果**:
- Auth.js v5（`next-auth@beta`）はNext.js 14+対応、Next.js 16で動作確認済み
- peer dependency警告あるが機能的には問題なし
- 環境変数プレフィックスが`NEXTAUTH_`→`AUTH_`に変更
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`はGitHub Providerが自動検出
- `AUTH_SECRET`が必須（セッション暗号化用）

**設計への影響**:
- `next-auth@beta`をインストール
- 環境変数は`AUTH_`プレフィックスを使用

### Topic 2: セッション戦略（JWT vs Database）

**ソース**: Auth.js Session Strategies ドキュメント

**比較**:
| 観点 | JWT | Database |
|------|-----|----------|
| 速度 | 高速（DB不要） | DBアクセス必要 |
| スケーラビリティ | ステートレス | DB依存 |
| トークン失効 | 即時失効不可 | セッション削除で対応可 |
| アクセストークン保管 | 暗号化Cookie内 | Accountテーブル |

**決定**: **JWT戦略を採用**
- Prisma Adapterと併用し、`session: { strategy: "jwt" }` を明示指定
- Accountテーブルにはアクセストークンが自動保存される（Adapterの機能）
- JWTのcallbacksでアクセストークンをセッションに含める

### Topic 3: Auth.js Prisma Adapter

**ソース**: Auth.js Prisma Adapter ドキュメント

**必要なモデル**:
- `User`: id, name, email, emailVerified, image + アプリ固有フィールド
- `Account`: OAuth情報（provider, providerAccountId, access_token等）
- `Session`: JWT戦略ではアクティブに使用されないが、将来のDB戦略移行に備え定義
- `VerificationToken`: Email Provider用（今回不要だが標準として定義）

**設計への影響**:
- 既存の`DiagnosisResult.userId`をUser.idとリレーション化
- Account.access_tokenにGitHub OAuthトークンが自動保存

### Topic 4: セキュリティ対策

**ソース**: Auth.jsドキュメント、OWASP

**Auth.jsが自動対応するセキュリティ**:
| 脅威 | 対策 | 実装方法 |
|------|------|----------|
| CSRF | Double-submit cookieパターン | Auth.js自動 |
| セッションハイジャック | Cookie: HttpOnly, Secure, SameSite=Lax | Auth.js自動 |
| トークン漏洩 | JWT暗号化（JWE） + AUTH_SECRET | Auth.js自動 |
| OAuthリプレイ攻撃 | stateパラメータ検証 | Auth.js自動 |
| セッション固定攻撃 | ログイン時セッションID再生成 | Auth.js自動 |

**追加で設計に含める対策**:
- OAuthスコープを`read:user`に制限（最小権限）
- エラーメッセージはユーザー向けに汎用化、詳細はサーバーログのみ
- Cookie属性: `__Host-`プレフィックス（本番HTTPS環境）

### Topic 5: ルート保護（Middleware/Proxy）

**ソース**: Auth.js公式ドキュメント

**Next.js 16での変更**:
- `middleware.ts` → `proxy.ts`に名称変更（`middleware`→`proxy`エクスポート）
- Auth.jsの`auth`関数をproxyとしてエクスポートすることでルート保護

**注意点**:
- proxyだけに依存せず、Server Component/API Routeでも`auth()`で二重チェック推奨
- マッチャーで`/login`と`/api/auth`を除外する必要あり

### Topic 6: 既存コード分析

**githubClient.ts**:
- 固定トークン（環境変数から復号）と固定ユーザー名でGraphQL API呼び出し
- → トークンとユーザー名をパラメータとして受け取るよう変更必要

**skillsUseCases.ts**:
- `skillsUseCases()` → パラメータなしで`fetchGitHubRepositories()`を呼び出し
- → アクセストークンを引数で受け取るよう変更必要

**skill/page.tsx**:
- Server Componentで`skillsUseCases()`を直接呼び出し
- → `auth()`でセッション取得後、トークンを渡す形に変更

**参考リポジトリ**: https://github.com/iwsh/oauth-tutorial
- OAuthフロー（GitHub認可→一時code→バックエンドでトークン取得→ユーザー情報取得→Cookie格納）をAuth.jsが内部的に実現

---

## 設計決定

| 決定 | 選択 | 理由 |
|------|------|------|
| 認証ライブラリ | Auth.js v5（next-auth@beta） | OAuth/セッション/セキュリティ自動化、Next.js 16互換 |
| セッション戦略 | JWT + Prisma Adapter | 高速・ステートレス、Accountテーブルにトークン自動保存 |
| OAuthスコープ | `read:user`のみ | 最小権限、パブリックリポジトリアクセスに追加スコープ不要 |
| DB Adapter | @auth/prisma-adapter | 既存Prismaスキーマとの統合 |
| ルート保護 | proxy.ts + Server Component二重チェック | Auth.js公式推奨パターン |

## リスク

| リスク | 影響度 | 軽減策 |
|--------|--------|--------|
| Auth.js v5がbeta | 中 | 広く本番利用実績あり、安定版リリース時にアップデート |
| Next.js 16 proxy.ts互換性 | 低 | 動作確認済み、peer dependency警告のみ |
| JWTサイズ超過（4KB Cookie制限） | 低 | Auth.jsが自動チャンキング対応 |
| GitHubトークン期限切れ | 中 | Account.refresh_tokenを利用した更新ロジック検討（将来） |
