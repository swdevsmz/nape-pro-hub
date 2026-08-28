---
id: "007"
title: "Like閲覧数とランキングを実装"
status: pending
priority: 2
dependencies: ["003", "005"]
estimated_complexity: high
---

# Task: Like閲覧数とランキングを実装

## Goal

匿名/登録Like、重複防止、閲覧数、期間別人気設定と人気投稿者を提供する。

## Interfaces

```typescript
type RankingPeriod = "today" | "week" | "month" | "all"; // 🔵
interface LikeService { add(configId: string, actor: Actor): Promise<{ liked: true; likeCount: number }>; remove(configId: string, actor: Actor): Promise<void> } // 🔵
```

## Test Strategy

- [ ] 同一actorの二重Likeがunique制約で防止される。
- [ ] DELETEでLike数が1減り、匿名票もランキングに加算される。
- [ ] 期間境界、hidden/deleted除外、登録ユーザー限定creator集計を検証する。
- [ ] 同時リクエストでカウンターが負数/過剰にならない。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:521-631`
- D1 transactionでlike rowとcounterを更新し、閲覧は日次actor hashで重複排除する。

## Files

- 新規: `src/app/api/configs/[id]/like/route.ts`, `src/app/api/configs/[id]/view/route.ts`, `src/app/api/rankings/*`, `src/features/likes/*`, `src/features/rankings/*`
- テスト: `tests/workers/likes.test.ts`, `tests/workers/rankings.test.ts`, `e2e/engagement.spec.ts`
