# Research & Design Decisions

## Summary
- **Feature**: `github-language-stats`
- **Discovery Scope**: Extension（既存スキルページへの言語統計機能追加）
- **Key Findings**:
  - 既存GraphQLクエリの`languages(first: 1)`を`languages(first: 20)`に拡張し、`totalSize`と各言語の`size`を追加取得する必要がある
  - `privacy: PUBLIC`フィルタが現行クエリに未適用 — 要件に従い追加が必要
  - 円グラフはSVGベースで実装可能（外部ライブラリ不要）、バンドルサイズ影響なし

## Research Log

### GitHub GraphQL API — languages フィールド仕様
- **Context**: 要件4で各リポジトリの言語バイト数を取得する必要がある
- **Sources Consulted**: GitHub GraphQL API公式ドキュメント
- **Findings**:
  - `Repository.languages`は`LanguageConnection`を返す
  - 各`LanguageEdge`に`size`（バイト数）と`node.name`（言語名）がある
  - `languages.totalSize`でリポジトリ全体のバイト数合計を取得可能
  - `first: 20`で最大20言語まで取得可能（要件4.2）
- **Implications**: 現行クエリの`languages.nodes`を`languages.edges`に変更し、`size`フィールドを追加する

### GitHub GraphQL API — privacy フィルタ
- **Context**: 非機能要件1でPublicリポジトリのみ取得が必要
- **Sources Consulted**: GitHub GraphQL API公式ドキュメント
- **Findings**:
  - `repositories`フィールドに`privacy: PUBLIC`引数を指定可能
  - 現行クエリには未適用 — 全リポジトリ（Private含む）を取得している可能性あり
- **Implications**: クエリに`privacy: PUBLIC`を追加

### 円グラフ実装アプローチ
- **Context**: 非機能要件5で重量級ライブラリを避ける必要がある
- **Sources Consulted**: SVG仕様、CSS conic-gradient、既存軽量ライブラリ比較
- **Findings**:
  - SVG `<circle>` + `stroke-dasharray`/`stroke-dashoffset`でドーナツチャートを描画可能
  - CSS `conic-gradient`はブラウザ互換性が十分だが、`aria`属性付与がSVGより困難
  - 外部ライブラリなしでReactコンポーネントとして実装可能
- **Implications**: SVGベースのドーナツチャートコンポーネントを自作。アクセシビリティ（要件NFR-8）はaria属性 + 数値リスト併記で対応

### 既存アーキテクチャ — 拡張ポイント分析
- **Context**: 既存コードへの変更を最小限にしつつ言語統計を追加
- **Findings**:
  - `skillResult.ts`: 型定義のみに縮小（`GitHubLanguageEdge`等を追加）、API通信ロジックはInfrastructure層へ移動
  - `infrastructure/githubClient.ts`: 新設 — API通信・トークン復号を担当
  - `skillsUseCases.ts`: `SkillSummary`型に言語データを追加、集計ロジックを追加
  - `app/skill/page.tsx`: Server Componentのため、集計済みデータを受け取りUIに渡す
  - 円グラフは`"use client"`不要 — SVGはServer Componentで描画可能
- **Implications**: 5層アーキテクチャ（domain → infrastructure → application → presentation）に拡張。API通信をInfrastructure層に分離

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| 既存4層拡張 | 現行のdomain→use-case→page→component構成を維持 | 変更最小 | API通信とドメインロジックの混在が継続 | 不採用 |
| 5層（Infrastructure層新設） | domain→infrastructure→application→presentation構成 | DDD的に正しい責務分離、テスタビリティ向上 | 既存コードのリファクタリング必要 | 採用 |
| 専用API Route追加 | `/api/skills/languages`エンドポイント新設 | クライアント側でのキャッシュ制御 | 不要な複雑化、Server Componentで十分 | 不採用 |

## Design Decisions

### Decision: GraphQLクエリ拡張方式
- **Context**: 言語バイト数データの取得方法
- **Alternatives Considered**:
  1. 既存クエリを拡張して言語データを含める
  2. 別途REST APIで言語データを取得（N+1リクエスト発生）
- **Selected Approach**: 既存クエリ拡張（`languages.edges`に`size`追加）
- **Rationale**: 非機能要件3（1回のGraphQLクエリで完結）を満たす
- **Trade-offs**: クエリのレスポンスサイズ増加（ただし最大20言語×100リポジトリで許容範囲）
- **Follow-up**: レスポンスサイズの実測確認

### Decision: 円グラフ実装方式
- **Context**: 非機能要件5（重量級ライブラリ不要）と非機能要件8（アクセシビリティ）の両立
- **Alternatives Considered**:
  1. SVGドーナツチャート（自作）
  2. CSS conic-gradient
  3. 軽量ライブラリ（例: lightweight-charts）
- **Selected Approach**: SVGドーナツチャート（自作Reactコンポーネント）
- **Rationale**: バンドルサイズ0追加、aria属性の柔軟な付与が可能、Server Componentで描画可能
- **Trade-offs**: 自作のため実装工数が若干増加するが、要件を満たす最小限の実装
- **Follow-up**: なし

### Decision: 集計ロジックの配置
- **Context**: 言語割合の計算（1%未満集約、四捨五入など）をどの層で行うか
- **Alternatives Considered**:
  1. ユースケース層で集計
  2. ドメイン層で集計
  3. UIコンポーネント層で集計
- **Selected Approach**: アプリケーション層（`skillsUseCases.ts`）で集計
- **Rationale**: ビジネスロジック（割合計算・閾値判定）はアプリケーション層の責務。ドメイン層は型定義のみ。Infrastructure層はAPI通信のみ。プレゼンテーション層は表示のみ
- **Trade-offs**: アプリケーション層の肥大化リスクがあるが、集計関数を純粋関数として分離すれば管理可能
- **Follow-up**: 集計関数のユニットテスト作成

## Risks & Mitigations
- **GraphQLクエリ複雑化** — `languages(first: 20)`追加によるレート制限消費増加 → 100リポジトリ×20言語でもコスト許容範囲内
- **1%未満集約ロジックの境界ケース** — 全言語が1%未満のリポジトリ → 全て「その他」にまとめる（正常動作）
- **同率最大言語の判定** — Unicode昇順ルール（要件3.2）で一意に決定

## References
- GitHub GraphQL API Explorer — languages フィールド仕様
- SVG stroke-dasharray — MDN Web Docs
- WCAG 2.1 — Non-text Content (1.1.1) ガイドライン
