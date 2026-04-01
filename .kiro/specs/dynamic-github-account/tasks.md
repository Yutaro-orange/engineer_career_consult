# 実装タスク: dynamic-github-account

## タスク 1: Auth.jsパッケージのインストールとPrismaスキーマ拡張

Auth.js v5と関連パッケージをインストールし、認証に必要なデータベースモデルを追加する。

- [x] 1.1 `ne t-auth@beta`と`@auth/prisma-adapter`をインストールする
  - **要件**: 1.3, 1.4, 1.8
- [x] 1.2 Prismaスキーマに`User`、`Account`、`Session`、`VerificationToken`モデルを追加し、既存の`DiagnosisResult.userId`を`User`へのオプショナルリレーションに変更する。マイグレーションを実行してDBに反映する
  - **要件**: 1.4, 1.5, 4.1
- [x] 1.3 Auth.js用の型拡張ファイルを作成し、`Session`型に`user.id`を含めるよう定義する
  - **要件**: 4.3

## タスク 2: Auth.js設定とAPIルート作成 (P)

Auth.jsの中核設定ファイルとOAuthコールバックハンドラを作成する。

- [x] 2.1 `auth.ts`をプロジェクトルートに作成し、GitHub OAuthプロバイダー（スコープ: `read:user`）、PrismaAdapter、database戦略、コールバック（session, authorized, redirect）を設定する
  - **要件**: 1.2, 1.3, 1.8, 1.9, 3.1, 3.3, 4.1, 4.3
- [x] 2.2 `app/api/auth/[...ne tauth]/route.ts`を作成し、Auth.jsのhandlersをGET/POSTとしてエクスポートする
  - **要件**: 1.3, 1.6, 1.7

## タスク 3: access_token取得ヘルパーの作成 (P)

セッションのuserIdからDBのAccountテーブル経由でGitHub access_tokenを取得するヘルパー関数を作成する。

- [x] 3.1 `getAccessToken(userId)`関数を作成し、Prisma経由でAccountテーブルからGitHubプロバイダーのaccess_tokenを取得する
  - **要件**: 1.8, 2.1, 2.4

## タスク 4: ログイン画面の作成

GitHubログインボタンとエラーメッセージ表示を含むログイン画面を作成する。

- [x] 4.1 `app/login/page.ts `にServer Componentとしてログイン画面を作成する。searchParamsからエラーパラメータを取得し、エラー時は汎用メッセージを表示する。GitHubログインボタンは`signIn("github")`を呼び出すClient Componentとして実装する
  - **要件**: 1.1, 1.2, 1.6, 1.7

## タスク 5: ルート保護の設定

pro y.tsを作成し、未認証ユーザーをログイン画面にリダイレクトするルート保護を実装する。

- [x] 5.1 `pro y.ts`をプロジェクトルートに作成し、Auth.jsの`authorized`コールバックによるルート保護を設定する。`/login`、`/api/auth`、静的アセット、ルートパスをパブリックアクセスとして除外する
  - **要件**: 3.1, 3.2, 4.2, 4.4

## タスク 6: ログアウト機能の作成

ログアウトボタンコンポーネントを作成し、既存画面に配置する。

- [x] 6.1 `signOut({ callbackUrl: "/login" })`を呼び出すClient Componentとしてログアウトボタンを作成し、メニュー画面のヘッダーに配置する
  - **要件**: 5.1, 5.2

## タスク 7: GitHub APIクライアントのパラメータ化

固定トークン・固定ユーザー名による呼び出しを、OAuthアクセストークンによる動的呼び出しに変更する。

- [x] 7.1 `fetchGitHubRepositories()`の引数に`accessToken`パラメータを追加し、環境変数による固定トークン復号とユーザー名取得のコードを削除する。GraphQLクエリでは`viewer`を使用してトークン所有者のリポジトリを取得するようにする
  - **要件**: 2.1, 2.4

## タスク 8: ユースケース層のパラメータ化

skillsUseCasesにaccessTokenを引数として受け取り、GitHubクライアントに伝搬する。

- [x] 8.1 `skillsUseCases()`の引数に`accessToken`パラメータを追加し、`fetchGitHubRepositories(accessToken)`に伝搬する
  - **要件**: 2.1, 2.4

## タスク 9: スキル画面のセッション連携

スキル画面でセッションからユーザー情報を取得し、動的にスキルデータを表示する。

- [x] 9.1 `app/skill/page.ts `でAuth.jsの`auth()`からセッションを取得し、`getAccessToken(userId)`でaccess_tokenを取得した上で`skillsUseCases(accessToken)`を呼び出す。トークン取得失敗時はエラーメッセージを表示する
  - **要件**: 2.1, 2.2, 2.3, 2.4
- [x]* 9.2 スキル画面でのローディング状態表示をSuspense fallbackで実装する
  - **要件**: 2.2

## タスク 10: 環境変数の設定と動作確認

認証に必要な環境変数を設定し、全フローの動作を確認する。

- [x] 10.1 `.env.e ample`に`AUTH_SECRET`、`AUTH_GITHUB_ID`、`AUTH_GITHUB_SECRET`を追加し、不要になった`GITHUB_TOKEN_ENCRYPTED`と`GITHUB_USERNAME`の説明を更新する
  - **要件**: 1.9
- [ ]* 10.2 OAuthログインフロー（ログイン→メニュー遷移→スキル画面表示→ログアウト）の一連の動作を手動確認する
  - **要件**: 1.1, 1.2, 1.3, 2.1, 3.1, 3.3, 4.1, 5.2

## 要件カバレッジ

| 要件 | タスク |
|------|--------|
| 1.1 | 4.1 |
| 1.2 | 2.1, 4.1 |
| 1.3 | 1.1, 2.1, 2.2 |
| 1.4 | 1.2 |
| 1.5 | 1.2 |
| 1.6 | 2.2, 4.1 |
| 1.7 | 2.2, 4.1 |
| 1.8 | 2.1, 3.1 |
| 1.9 | 2.1, 10.1 |
| 2.1 | 3.1, 7.1, 8.1, 9.1 |
| 2.2 | 9.1, 9.2 |
| 2.3 | 9.1 |
| 2.4 | 3.1, 7.1, 8.1, 9.1 |
| 3.1 | 2.1, 5.1 |
| 3.2 | 5.1 |
| 3.3 | 2.1 |
| 4.1 | 1.2, 2.1 |
| 4.2 | 5.1 |
| 4.3 | 1.3, 2.1 |
| 4.4 | 5.1 |
| 5.1 | 6.1 |
| 5.2 | 6.1 |
