# プロジェクトコンテキスト

> dev-contextにより生成。最終更新: 2026-08-29
> 信頼度: 🔵 = ソース/承認済み計画、🟡 = 計画上の規約、🔴 = 未解決の仮定

## 現在の状態

- 🔵 リポジトリはグリーンフィールド。既存の追跡対象プロダクトファイルは `napepro_service_design.md` のみ。
- 🔵 パッケージ定義、アプリケーションソース、テスト設定、CIワークフロー、マイグレーション、実行環境設定はまだ存在しない。
- 🔵 承認済み実装計画は `docs/dev/plans/napepro-hub-mvp/` にあり、MVP Phase 1だけを対象とする。

## 技術スタック

| 分類 | 採用内容 | 信頼度 |
|---|---|---|
| 言語 | TypeScript（strictモード） | 🔵 承認済み計画 |
| 開発/CIランタイム | Node.js 24 LTS | 🔵 承認済み計画 |
| 本番ランタイム | Cloudflare Workers runtime | 🔵 設計書/承認済み計画 |
| フレームワーク | Next.js 16 App Router + vinext | 🔵 承認済み計画 |
| ホスティング | Cloudflare Workers | 🔵 設計書/承認済み計画 |
| パッケージマネージャ | pnpm（lockfileをコミット） | 🔵 承認済み計画 |
| データベース | Cloudflare D1 + Drizzle ORM | 🔵 承認済み計画 |
| 認証 | Better Auth、Google OAuthのみ | 🔵 承認済み計画 |
| 非同期処理 | Cloudflare Queues | 🔵 承認済み計画 |
| 意味検索 | Workers AI + Vectorize | 🔵 設計書/承認済み計画 |
| 荒らし対策 | Cloudflare Turnstile + actor/IPハッシュ単位のRate Limit | 🔵 設計書/承認済み計画 |

Node.js 24 LTSは開発・CIのツールチェーンにのみ使用し、本番コードはWorkers runtimeのWeb APIとBindingsを前提とする。`nodejs_compat`は必要な依存が確認できた場合だけ有効化し、理由と対象パッケージを記録する。
Task 003でバージョンを`package.json`と`pnpm-lock.yaml`に固定する。アプリ依存・Wrangler・vinextの浮動する`latest`指定は使用しない。

## テスト環境

| 層 | 計画上のフレームワーク | 配置先 | Task 003後のコマンド |
|---|---|---|---|
| 単体/コンポーネント | Vitest + React Testing Library + jsdom | `src/**/*.test.ts(x)` | `pnpm test` |
| Workers/D1統合 | Vitest + `@cloudflare/vitest-plugin` | `tests/workers/**/*.test.ts` | `pnpm test:workers` |
| エンドツーエンド | Playwright | `e2e/**/*.spec.ts` | `pnpm test:e2e` |
| カバレッジ | Vitest coverage | テストと同階層 | `pnpm test:coverage` |

🔵 現時点では実行可能なテストコマンドはない。Task 003で上記スクリプトに加え、`pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm preview`、統合コマンド`pnpm check`を作成してから機能実装を始める。

## 計画中のプロジェクト構成

```text
src/
├── app/                    # App Routerのルート、薄いPage、Route Handler、metadata
│   ├── (public)/           # 公開ページ（URLには影響しないRoute Group）
│   ├── (auth)/             # ログイン等の認証導線
│   ├── (account)/          # マイページ等の利用者導線
│   ├── admin/              # 管理UI
│   └── api/                # Route Handler
├── features/               # 機能別UI、ユースケース、機能固有ドメイン
│   ├── auth/               # 認証
│   ├── configs/            # 設定投稿・閲覧
│   ├── search/             # 意味検索
│   ├── likes/              # いいね
│   ├── rankings/           # ランキング
│   └── moderation/         # モデレーション
├── domain/                 # 複数機能で共有する最小限の型、契約、ルール
├── infrastructure/         # Cloudflare/D1/Auth/AI/Queue等のアダプタ
│   ├── cloudflare/         # Bindings、env、Cloudflare固有importの唯一の入口
│   ├── db/                 # Drizzleスキーマ、client、repository
│   ├── auth/               # Better Authアダプタ
│   ├── indexing/           # Queue consumer、Embedding、Vectorize更新
│   ├── vectorize/          # Vectorizeアダプタ
│   ├── turnstile/          # Turnstileサーバー検証
│   └── rate-limit/         # Rate Limitアダプタとカウンター
├── shared/                 # 機能横断のui、validation、errors、logging、seo、analytics
└── styles/                 # グローバル/共有スタイル
tests/
├── workers/                # WorkerランタイムとD1の統合テスト
└── fixtures/nape/          # バージョン管理したNape Pro JSON fixture
e2e/                        # Playwrightユーザージャーニー
drizzle/                    # 生成してコミットするD1マイグレーション
docs/dev/plans/             # tsumikiの計画、タスク、レポート
```

この構成はTask 003で作成されるまで🟡。既存パターンではなく承認済みの目標構成である。

### 依存方向と責務

```text
app → features → domain
infrastructure → domain
shared → domainの共有契約のみ
```

- `src/app`はルーティング、認証境界、入力検証の起点、ユースケース呼び出し、APIレスポンス変換だけを担当する。ビジネスロジックと直接のD1/AI/Queue呼び出しを置かない。
- `src/features/*/domain`は機能固有の型・不変条件・ドメインルールを持つ。機能固有型を`src/domain`へ集約しない。
- `src/domain`は`Actor`、共通エラー、横断契約など複数機能で共有する最小限のフレームワーク非依存コードだけを持つ。`contracts.ts`を機能固有型の集積場所にしない。
- `src/shared`は機能横断のUI、validation、errors、logging、SEO、analyticsに限定し、ビジネスルールと機能固有コードを置かない。
- `src/infrastructure`だけがD1、Drizzle、Better Auth、Workers AI、Vectorize、Queues、Turnstile、Rate Limitなどの外部サービスを知る。
- `cloudflare:workers`、Workers固有の型、Bindingsへの直接依存は`src/infrastructure/cloudflare`以下に限定し、他層へアダプタの契約を提供する。
- Server Component/Client Componentの境界を明示し、Client Componentへ渡すpropsは実際に使用する最小限の値にする。

## コーディング規約

### 命名

| 対象 | 規約 | 例 | 信頼度 |
|---|---|---|---|
| 変数/関数 | camelCase | `createConfig` | 🟡 |
| コンポーネント/型 | PascalCase | `ConfigCard`, `SearchResult` | 🟡 |
| 定数 | UPPER_SNAKE_CASE | `MAX_CONFIG_BYTES` | 🟡 |
| ソースファイル | kebab-case | `config-parser.ts` | 🟡 |
| DBカラム | snake_case | `anonymous_user_id` | 🔵 設計書 |
| テスト | `*.test.ts(x)` / `*.spec.ts` | `config-parser.test.ts` | 🔵 承認済み計画 |

### アーキテクチャ

- ドメイン/アプリケーションコードからNext.jsやCloudflareのグローバルを直接importせず、インフラアダプタ経由にする。🟡
- Route Handlerは入力を検証し、ユースケースを呼び、型付きエラーを共通APIレスポンスへ変換する。🟡
- Queueメッセージと永続化payloadは明示的にバージョン管理し、冪等にする。🔵
- `any`と無制限の`unknown`を避け、外部入力は境界でスキーマにより絞り込む。🔵
- secret、匿名credential、生IP、編集コードをストレージやログに残さない。🔵
- 独立したデータ取得は`Promise.all`で並列化し、Server Component/API Routeのwaterfallを作らない。🟡
- 重量UI・エディタ・管理用ウィジェットはdynamic importし、初期表示のbundleへ含めない。🟡
- 公開コンテンツは明示的なrevalidate/cache方針を持ち、認証情報・個人情報・更新操作はno-storeとする。🟡
- 公開詳細・ランキング・新着一覧はページ単位でrevalidate方針を定義し、検索結果はクエリ単位でキャッシュ可否を定義する。🟡
- Like、投稿、編集、削除、管理操作のレスポンスはキャッシュしない。🟡
- 外部script・analytics・管理用ウィジェットは初期レンダリングを妨げない。🟡
- 長い一覧はcursor paginationを使い、必要な場合だけcontent-visibility等を検討する。🟡

### エラー処理

- 安定したエラーコードを持つ型付きドメイン/アプリケーションエラーを使用する。
- 公開APIエラーは`{ error: { code, message, fieldErrors?, requestId } }`とする。
- 明示的に再試行可能なインフラ障害だけを再試行し、検証/認可エラーは再試行しない。

### Cloudflareサービス契約

- Rate Limiting bindingは短周期の粗い防御に使用する。標準の周期で表現できない「投稿5件/時、Like60件/時、編集30件/時」は、D1/KV/Durable ObjectsのうちTask 008で選定した時間単位カウンターで実現する。
- Rate Limitのキーは、認証actor ID、匿名actor ID、IPのkeyed hashを用途別に組み合わせる。Rate Limiting bindingのロケーション単位・最終的整合性を前提とし、厳密なLike集計や会計用途には使わない。
- IPは生値を永続化・ログ出力しない。IP hash用のsecret、ローテーション、用途分離を環境設定に記録する。
- Turnstileは必ずサーバー側で検証する。tokenの単一使用、5分の有効期限、検証失敗・期限切れ時の再発行/resetを扱い、secretをクライアントへ送らない。
- VectorizeはEmbeddingモデル名、出力dimension、distance metricをindex作成前に確定する。metadata filter対象と型を列挙し、metadata indexをvector投入前に作成する。
- Vectorize metadata indexは1 indexあたり最大10プロパティとし、index作成後に投入済みvectorを再upsertする必要がある場合の手順を定義する。
- Queueは少なくとも一度配送を前提とし、各メッセージを個別に`ack`または`retry`する。AI/Vectorizeの一時障害だけをretryし、検証エラー・未知revision・削除済みデータは再試行しない。
- Queue consumerには`max_retries`、retry delay、DLQ、永続失敗の監視を設定する。jobは`configId + revision + operation`で冪等にする。
- D1はprepared statement/Drizzleを使い、必要なindexとforeign keyをmigrationで管理する。migrationはlocalとremoteの両方で検証し、read-after-writeが必要な処理ではprimary DBを使う。
- D1の1MiB row sizeを前提とし、投稿JSONをD1に保存する場合はサイズ上限を別途検証する。大きなバイナリやraw payloadはD1へ保存しない。
- local、preview、productionのBindingsは`wrangler`の各environmentに明示し、D1、Queue、Vectorize、Workers AI、Turnstileの接続先を混在させない。

### importスタイル

- external、`@/`内部、相対/型専用の順に並べる。
- named importと`import type`を優先する。
- 機能境界を越える場合は内部実装でなく公開モジュール契約を利用する。

### ログ

- `requestId`、操作、actor種別、設定ID、処理時間、結果を含む構造化JSONを出力する。
- OAuth token、Cookie、JSON payload、raw IP、編集コード、匿名credentialをログに出さない。

## 主要エントリポイント

| モジュール | 計画ファイル | 役割 |
|---|---|---|
| ルートUI | `src/app/page.tsx` | 検索、今週のランキング、新着設定、公開導線 |
| 設定API | `src/app/api/configs/route.ts` | 設定の作成と一覧 |
| 設定個別API | `src/app/api/configs/[id]/route.ts` | 設定の取得、編集、削除 |
| 検索API | `src/app/api/search/route.ts` | 意味検索とフィルター |
| 認証API | `src/app/api/auth/[...all]/route.ts` | Better Authハンドラ |
| Queue consumer | `src/infrastructure/indexing/config-index-consumer.ts` | Embedding生成とVectorize更新 |
| ドメイン契約 | `src/domain/contracts.ts` | actor、設定、検索、ランキング、エラー型 |
| DBスキーマ | `src/infrastructure/db/schema.ts` | Drizzle D1スキーマと制約 |
| Nape parser | `src/features/configs/domain/config-parser.ts` | バージョン別JSON解析と抽出 |
| 管理UI | `src/app/admin/configs/page.tsx` | 非公開化、再公開、索引再試行 |

## ビルドと実行

現時点ではコマンドはない。Task 003で次を整備する。`next build`とWorkers向けvinext buildを混同しない。

| コマンド | 説明 |
|---|---|
| `pnpm dev` | Next.js開発サーバーを起動 |
| `pnpm dev:vinext` | vinext開発サーバーを起動 |
| `pnpm build:vinext` | Workers向け本番アプリケーションをビルド |
| `pnpm build` | CI標準ビルド（`build:vinext`を呼び出す） |
| `pnpm check:vinext` | `vinext check`で互換性を検証 |
| `pnpm preview:worker` | Workersランタイムで本番出力を実行 |
| `pnpm deploy:worker` | `@vinext/cloudflare deploy`でデプロイ |
| `pnpm lint` | ファイルを書き換えずlintを実行 |
| `pnpm typecheck` | TypeScriptチェックを実行 |
| `pnpm test` | 単体/コンポーネントテストを実行 |
| `pnpm test:workers` | Workers/D1統合テストを実行 |
| `pnpm test:e2e` | Playwrightテストを実行 |
| `pnpm check` | 必須品質ゲートを一括実行 |

## 情報源と制約

- プロダクト要件の原典: `napepro_service_design.md`。
- 承認済み範囲と判断: `docs/dev/plans/napepro-hub-mvp/plan.md`およびリンク先のFull-spec文書。
- Nape Pro JSON構造は未確定。Task 002で信頼できる実機出力/既存OSSの根拠を得るまでparserを発明しない。
- Embeddingモデル、Vectorize dimension、metric、metadata indexはTask 006で日本語fixtureのnDCG@10、Recall@10、p95、費用を比較して決定するまで未確定。🔴
- Rate Limitの時間単位カウンターの実装方式はTask 008で確定するまで未確定。🔴
- vinext互換性はTask 001/011の`vinext check`とWorkers previewで検証するまで未確定。🔴
- local / preview / productionのBindings、Secret名、migration適用順はTask 011で確定する。🔴
- MVP UIは日本語。英語のアプリ名・操作名・タグも検索対象にする。
- 対象外: WebHID、設定claim、お気に入り、類似設定、raw JSONダウンロード、実機への書込/適用、広告、アフィリエイト。
