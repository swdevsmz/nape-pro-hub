# Plan: napepro-hub-mvp

## Requirements Summary

Nape Pro設定を「用途・目的」から発見できる、日本語中心の共有サービスMVPを構築する。匿名ユーザーを一級市民として扱い、JSON投稿、意味検索、Like、期間別ランキング、Google OAuth、最小モデレーション、基本SEOをPhase 1の公開条件とする。

詳細: [requirements.md](requirements.md) | [user-stories.md](user-stories.md) | [acceptance-criteria.md](acceptance-criteria.md)

## Design Overview

- Next.js 16 + TypeScript strict + vinext on Cloudflare Workers。D1/Drizzle、Better Auth(Google)、Queues、Workers AI、Vectorize、Turnstileを使用する。
- Route Handlerを公開契約とし、`src/domain` → `src/features` → `src/infrastructure`の依存方向を固定する。
- 投稿はD1にpending保存→版付きQueue job→JSON解析/search text→Embedding→Vectorize upsert→初回公開。失敗は再試行可能なfailed状態にする。
- 匿名所有権はSecure HttpOnly Cookieを基本に、投稿別編集コードを復旧手段にする。Likeは匿名/登録とも1票。
- 検索候補上位50件をVectorizeから取得し、Semantic 85%・Popularity 10%・Freshness 5%で再ランキングする。

### Public contracts

`Actor`, `ConfigStatus`, `IndexStatus`, `ConfigUploadInput`, `ParsedNapeConfig`, `ConfigSummary`, `ConfigDetail`, `SearchQuery`, `SearchResult`, `RankingPeriod`, `ApiError`を`src/domain/contracts.ts`に定義する。すべてのAPIは`{ error: { code, message, fieldErrors?, requestId } }`形式のエラーを返す。

### Routes

`/`, `/search`, `/configs`, `/configs/[id]`, `/publish`, `/rankings`, `/creators`, `/users/[id]`, `/me`, `/login`, `/admin/configs`と、`/api/configs`, `/api/configs/[id]`, `/api/configs/[id]/like`, `/api/configs/[id]/view`, `/api/search`, `/api/rankings/configs`, `/api/rankings/creators`, `/api/auth/[...all]`を提供する。

## Task Dependency Graph

```text
001 → 002 → 005 → 006 → 010 → 011
  └→ 003 → 004 ─┘  ├→ 007 ─┘
                    └→ 008 ─┘
```

`003`は`002`と並行可能。`009`（品質/運用補強）は`005`〜`008`と並行可能だが、`011`の前に完了させる。

## Task Index

| ID | Task | Complexity | Dependencies |
|---|---|---|---|
| 001 | プロジェクト基盤と契約を作成 | medium | - |
| 002 | Nape JSON仕様を調査しparser契約を確定 | high | 001 |
| 003 | D1/認証/匿名所有権を実装 | high | 001 |
| 004 | 投稿・解析・非同期索引を実装 | high | 002,003 |
| 005 | 公開画面・詳細・プロフィールを実装 | medium | 004 |
| 006 | セマンティック検索を実装 | high | 004 |
| 007 | Like・閲覧数・ランキングを実装 | high | 003,005 |
| 008 | モデレーションと入力防御を実装 | high | 004,007 |
| 009 | SEO・計測・アクセシビリティを実装 | medium | 005,006,007,008 |
| 010 | 結合・E2Eテストと性能検証を実装 | high | 004,006,007,008 |
| 011 | Cloudflare previewとリリース品質ゲートを整備 | high | 009,010 |

## Cross-Plan Dependencies

なし。Phase 2（WebHID、claim、類似設定、お気に入り、広告/アフィリエイト）は別Planで作成する。

## Assumptions

- Nape JSONの実データ/既存OSS調査が完了するまでparserを推測実装しない。
- モデル選定は日本語評価fixtureのnDCG@10、Recall@10、p95、費用で決め、同点時はEmbeddingGemma 768次元を採用する。
- 既存コード・既存CI・既存規約はなく、本Planの`context.md`が初期規約である。
