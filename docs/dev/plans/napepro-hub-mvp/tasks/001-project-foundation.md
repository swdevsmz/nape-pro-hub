---
id: "001"
title: "プロジェクト基盤と契約を作成"
status: pending
priority: 1
dependencies: []
estimated_complexity: medium
---

# Task: プロジェクト基盤と契約を作成

## Goal

vinext/Next.js、TypeScript strict、pnpm、Wrangler、テスト、Lint、共通型を初期化し、後続タスクが同じ契約で実装できる状態にする。

## Interfaces

```typescript
type ConfigStatus = "pending" | "published" | "hidden" | "deleted"; // 🟡
type IndexStatus = "pending" | "ready" | "failed"; // 🟡
interface ApiError { code: string; message: string; requestId: string; fieldErrors?: Record<string, string[]> } // 🟡
```

## Test Strategy

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`が空の初期アプリで成功する。
- [ ] APIエラーシリアライザがrequestIdとcodeを必ず含める。
- [ ] Wrangler binding型生成がローカル設定と一致する。

## Implementation Notes

- 参照: `docs/dev/context.md`, `docs/dev/napepro_service_design.md:772-812`
- vinext compatibility checkをCI前提にする。D1/Queue/AI/Vectorize binding名を一箇所で管理する。

## Files

- 新規: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `wrangler.jsonc`, `src/domain/contracts.ts`, `src/shared/errors.ts`, `vitest.config.ts`, `playwright.config.ts`
- テスト: `src/shared/errors.test.ts`
