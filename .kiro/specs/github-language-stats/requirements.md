# Requirements Document

## Introduction
スキルページ（`app/skill/page.tsx`）は現在、GitHubリポジトリの名前・説明・主要言語のみを表示している。本機能では、GitHub GraphQL APIから各リポジトリの言語バイト数データを取得し、リポジトリ単位および全体の言語使用割合を可視化する。さらに、最も使用割合の高い言語をユーザーの「最大の強み」として明示的に表示する。

## 言語割合の計算ルール（共通）
以下は Requirement 1・2 の表示に共通して適用する。

1. 言語ごとのバイト数は GitHub が返す値を用いる。
2. 各スコープ（単一リポジトリ、または全リポジトリ横断）について、割合は「当該スコープ内の当該言語バイト数 ÷ 当該スコープの合計バイト数 × 100」で算出する。
3. **1% 未満の判定は四捨五入前の割合**で行い、該当する言語区分を「その他」にまとめて集約する。「その他」に含めたバイト数は合算し、1 つの区分として扱う。
4. **画面上に表示するパーセンテージのみ**小数点第 1 位を四捨五入する。

## Requirements

### Requirement 1: リポジトリごとの言語割合表示
**Objective:** As an engineer, I want 各リポジトリで使用されている言語の割合を確認したい, so that リポジトリごとの技術構成を把握できる

#### Acceptance Criteria
1. When スキルページを表示した時, the Skill Page shall 各リポジトリに対して使用言語の割合をパーセンテージで表示する
2. When スキルページを表示した時, the Skill Page shall 各リポジトリの言語割合を円グラフ形式でそのリポジトリの表示部分の下に視覚的に表示し、言語名の凡例を併記する
3. The Skill Page shall 使用割合が1%未満の言語を「その他」としてまとめて表示する
4. The Skill Page shall 言語割合をバイト数ベースで計算し、小数点第1位は四捨五入して表示する
5. If リポジトリに言語データが存在しない場合, then the Skill Page shall そのリポジトリの言語割合セクションを非表示にする

### Requirement 2: 全リポジトリ横断の言語割合表示
**Objective:** As an engineer, I want 全リポジトリを横断的に見た言語使用割合を確認したい, so that 自分の技術スキル全体の傾向を把握できる

#### Acceptance Criteria
1. When スキルページを表示した時, the Skill Page shall 全リポジトリの言語バイト数を合算し、全体の言語使用割合をパーセンテージで表示する
2. The Skill Page shall 全体の言語割合を円グラフで視覚的に表示し、言語名の凡例を併記する
3. The Skill Page shall 全体集計において使用割合が1%未満の言語を「その他」としてまとめて表示する
4. The Skill Page shall 全体の言語割合を使用割合の降順で表示する
5. The Skill Page shall 全体の言語割合セクションを個別リポジトリセクションよりも上部に配置する

### Requirement 3: 最大の強み言語の表示
**Objective:** As an engineer, I want 自分にとって最も強みとなる言語を明確に知りたい, so that 自分の強みを認識しキャリア判断に活かせる

#### Acceptance Criteria
1. When スキルページを表示した時, the Skill Page shall 全リポジトリ横断で使用割合（バイト数ベース）が最大の言語を特定し、「あなたの最大の強みは〇〇です」の形式で表示する
2. If 複数の言語が同率で最も高い使用割合の場合, then the Skill Page shall 言語名の Unicode コードポイント昇順で先頭となる言語を「最大の強み」とする
3. The Skill Page shall 最大の強み言語の表示を全体の言語割合セクションの上部に目立つ形で配置する
4. If 全リポジトリに言語データが存在しない場合, then the Skill Page shall 最大の強み言語セクションを非表示にする

### Requirement 4: GitHub API言語データ取得
**Objective:** As a system, I want GitHub GraphQL APIからリポジトリの言語バイト数データを取得したい, so that 言語割合の計算に必要なデータを提供できる

#### Acceptance Criteria
1. The Skill Fetch shall GitHub GraphQL APIから各リポジトリの言語名とバイト数（size）を取得する
2. The Skill Fetch shall 各リポジトリにつき最大20言語まで取得する
3. The Skill Fetch shall 呼び出し側が成功・失敗・取得0件を判別できる返却形式とする（失敗時は空リストに加え、失敗であることが分かる情報を渡す）
4. If GitHub APIからのレスポンスが失敗した場合, then the Skill Fetch shall 空のリポジトリリストを返却し、エラーをコンソールに出力する
5. If GitHub APIトークンが利用できない場合, then the Skill Fetch shall 空のリポジトリリストを返却する
6. If GitHub APIの取得に成功し取得リポジトリが0件の場合, then the Skill Page shall 「リポジトリが見つかりません」とメッセージを表示する

### 非機能要件

1. GitHub APIからのデータ取得に際しては、Publicリポジトリの情報のみを取得する（GraphQLクエリに`privacy: PUBLIC`フィルタを適用）
2. キーは漏洩しないよう暗号化し、GitHub上ではなくローカルのみで保管する（現行のAES-256-GCM + `.env.key`パターンを踏襲）
3. GitHub APIへのリクエストは1回のGraphQLクエリで完結させ、N+1リクエストを発生させない
4. GitHub GraphQL APIのレート制限（5,000ポイント/時間）を考慮し、過剰なデータ取得を避ける
5. 円グラフの実装にあたり、追加の重量級チャートライブラリを導入せず、CSS/SVGまたは軽量ライブラリで実装する（バンドルサイズ抑制）
6. While GitHub APIからデータを取得中, the Skill Page shall ローディングスピナーを表示する
7. GitHub APIレスポンスはNext.jsのfetch cacheを活用し、`next.revalidate` により **3600秒（1時間）** を目安とした再検証間隔を設定する（実装時に前後してよいが、設計で採用値を記録する）
8. The Skill Page shall 円グラフの情報を凡例または補助テキストで補い、主要な言語区分がスクリーンリーダーで把握できるようにする（例: 数値つきリストの併記、または適切な `aria` 属性）

## 受入条件

1. GitHub APIトークンが設定されている状態でスキルページにアクセスし、全体の言語割合円グラフ・強み言語・各リポジトリの円グラフが正しく表示されること
2. 言語データのないリポジトリでは円グラフが非表示になること
3. GitHub APIトークンが未設定の場合、エラーなくページが表示され、言語関連セクションが非表示になること（一覧エリアのメッセージは既存の「スキル情報を取得できませんでした。」等に準拠してよい）
4. GitHub APIの取得に成功しリポジトリが0件の場合、「リポジトリが見つかりません」が表示されること
5. Publicリポジトリのみが取得対象となっていること
6. `pnpm build`がエラーなく完了すること
7. GitHub APIトークンがクライアントサイドのHTML・JavaScriptに露出しないこと
8. `.env.key`がgit管理対象外（`.gitignore`に含まれている）であること
9. ブラウザの開発者ツール（Network タブ）でGitHub APIトークンがリクエスト/レスポンスに含まれないこと
