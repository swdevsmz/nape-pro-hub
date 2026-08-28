---
id: "006"
title: "セマンティック検索を実装"
status: pending
priority: 2
dependencies: ["004"]
estimated_complexity: high
---

# Task: セマンティック検索を実装

## Goal

日本語自然文をEmbedding検索し、metadata filterとSemantic中心の再ランキングを備えた検索画面を提供する。

## Interfaces

```typescript
interface SearchQuery { q: string; filters: SearchFilter; cursor?: string; limit?: number } // 🔵
interface SearchResult { items: ConfigSummary[]; nextCursor?: string; score: number } // 🟡
```

## Test Strategy

- [ ] 評価fixtureでEmbeddingモデルを比較し、選定根拠をレポートする。
- [ ] 上位50候補を取得し、公開済みだけを20件返す。
- [ ] application/layer_count/Gesture等のAND filterが機能する。
- [ ] 空・長大・不正filterを拒否し、p95 2秒以内を測定する。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:394-520`
- Vector indexの次元は作成後変更不可のため、モデル選定をindex作成前に完了する。

## Files

- 新規: `src/app/api/search/route.ts`, `src/app/search/page.tsx`, `src/features/search/*`, `src/infrastructure/vectorize/*`
- テスト: `src/features/search/ranking.test.ts`, `tests/workers/search.test.ts`, `e2e/search.spec.ts`
