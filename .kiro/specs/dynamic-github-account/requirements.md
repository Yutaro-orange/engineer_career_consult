# Requirements Document

## Introduction
現在、技術力判断画面（スキル分析）は固定のGitHubアカウントのデータを表示している。本機能では、GitHub OAuthによるログイン機能を導入し、ユーザー自身のGitHubアカウントに基づいた技術力分析を動的に提供する。これにより、各ユーザーが自分自身のスキルセットを客観的に把握できるようになる。

## Requirements

### Requirement 1: GitHub OAuthログイン
**Objective:** ユーザーとして、GitHubアカウントでOAuthログインしたい。そうすることで、簡単かつ安全に自分のGitHubデータへのアクセスを許可できるようにする。

#### Acceptance Criteria
1. When 未ログイン状態のユーザーがアプリにアクセスした時, the アプリ shall 「GitHubでログイン」ボタンを含むログイン画面を表示する
2. When ユーザーが「GitHubでログイン」ボタンを押した時, the アプリ shall GitHubのOAuth認証画面にリダイレクトする
3. When ユーザーがGitHub上で認可を完了した時, the アプリ shall コールバックを受け取り、アクセストークンを取得してメニュー画面にリダイレクトする
4. When 初回ログインのユーザーがOAuth認証を完了した時, the アプリ shall GitHubユーザーID・ユーザー名・アバターURLをデータベースに自動登録する
5. When 登録済みユーザーがOAuth認証を完了した時, the アプリ shall 既存のユーザー情報を更新してログイン状態にする
6. If ユーザーがGitHub上で認可を拒否した場合, then the アプリ shall ログイン画面に戻りエラーメッセージを表示する
7. If OAuth認証プロセスでエラーが発生した場合, then the アプリ shall エラーメッセージを表示し再ログインの手段を提供する
8. The アプリ shall OAuthアクセストークンをセッションに安全に保管する
9. The アプリ shall GitHub OAuthのスコープを最小権限に制限する（`read:user`のみ、パブリックリポジトリアクセスは追加スコープ不要）

### Requirement 2: 動的技術力分析表示
**Objective:** ログイン済みユーザーとして、自分のGitHubアカウントに基づいた技術力分析を確認したい。そうすることで、自分自身のスキルセットを客観的に把握できるようにする。

#### Acceptance Criteria
1. When ログイン済みユーザーが技術力判断画面にアクセスした時, the アプリ shall ログイン中ユーザーのOAuthアクセストークンを使用してGitHubリポジトリデータを取得し表示する
2. While 技術力判断画面のデータを取得中の間, the アプリ shall ローディング状態を表示する
3. If GitHub APIからのデータ取得に失敗した場合, then the アプリ shall エラーメッセージを表示し再取得の手段を提供する
4. The アプリ shall 固定のGitHubアカウントではなく、ログイン中ユーザーのOAuthトークンによるAPIアクセスをデータソースとして使用する

### Requirement 3: 認証状態に基づく画面遷移制御
**Objective:** システムとして、未認証ユーザーが診断機能に直接アクセスすることを防止したい。そうすることで、GitHubログインを確実に経由させる。

#### Acceptance Criteria
1. When 未ログインユーザーが診断ページや技術力判断画面に直接アクセスした時, the アプリ shall ログイン画面にリダイレクトする
2. While ユーザーがログイン状態の間, the アプリ shall 診断ページ・技術力判断画面・メニュー画面へのアクセスを許可する
3. When ログインが完了した時, the アプリ shall メニュー画面にリダイレクトする

### Requirement 4: セッション管理
**Objective:** ログイン済みユーザーとして、セッションが維持されてほしい。そうすることで、再訪問時にも再ログインなしで利用できるようにする。

#### Acceptance Criteria
1. When ユーザーがOAuthログインを完了した時, the アプリ shall セッションを作成し永続化する
2. While 有効なセッションが存在する間, the アプリ shall 再ログインなしで各画面へのアクセスを許可する
3. While ユーザーがログイン状態の間, the アプリ shall 各画面でログイン中のGitHubアカウント情報を利用可能にする
4. If セッションが無効または期限切れの場合, then the アプリ shall ログイン画面にリダイレクトする

### Requirement 5: ログアウト
**Objective:** ログイン済みユーザーとして、ログアウトしたい。そうすることで、別のGitHubアカウントでの再ログインや安全なセッション終了ができるようにする。

#### Acceptance Criteria
1. While ユーザーがログイン状態の間, the アプリ shall ログアウトボタンを表示する
2. When ユーザーがログアウトボタンを押した時, the アプリ shall セッションを破棄しログイン画面にリダイレクトする
