---
id: "010"
title: "結合E2Eテストと性能検証を実装"
status: pending
priority: 2
dependencies: ["004", "006", "007", "008"]
estimated_complexity: high
---

# Task: 結合E2Eテストと性能検証を実装

## Goal

匿名公開から検索・Like・編集/削除、Google投稿、管理操作までの本番相当ユーザージャーニーを自動検証する。

## Interfaces

```typescript
interface TestFixture { seedConfigs(): Promise<void>; reset(): Promise<void> } // 🟡
```

## Test Strategy

- [ ] Playwrightで匿名公開→索引→検索→Like→削除を通す。
- [ ] OAuth test stubでログイン→投稿→プロフィール→マイ投稿を通す。
- [ ] Queue/AI/Vectorize障害、Turnstile失敗、Rate Limit超過を再現する。
- [ ] 公開/検索p95 2秒、受付p95 1秒、30秒以内検索反映95%を測定する。

## Implementation Notes

- CIでは本番secretを使わず、Turnstile test keysとWorkers local bindingsを使う。

## Files

- 新規: `e2e/*.spec.ts`, `tests/fixtures/*`, `scripts/measure-performance.ts`
- テスト: `tests/workers/*.test.ts`, `e2e/*.spec.ts`
