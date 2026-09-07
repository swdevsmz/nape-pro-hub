---
id: "001"
title: "プロジェクト基盤を作成"
status: pending
priority: 1
dependencies: []
estimated_complexity: medium
---

# Task: プロジェクト基盤を作成

## Goal

Next.js / vinext / TypeScript strict / pnpm / Wrangler / D1 / テスト基盤を初期化し、WebHID Readerと公開UIを実装できる最小構成を作る。

## Scope

- Next.js 16 App Router
- vinext
- Cloudflare Workers
- TypeScript strict
- pnpm lockfile
- D1 + Drizzle
- Vitest / React Testing Library / Playwright
- API error contract

MVPではBetter Auth、Queues、Workers AI、Vectorizeを追加しない。

## Interfaces

```typescript
type ConfigStatus = "published" | "hidden" | "deleted";

interface ApiError {
  code: string;
  message: string;
  requestId: string;
  fieldErrors?: Record<string, string[]>;
}
```

## Test Strategy

- [ ] `pnpm lint` が成功する
- [ ] `pnpm typecheck` が成功する
- [ ] `pnpm test` が成功する
- [ ] `pnpm build` が成功する
- [ ] Workers previewc񧈥llo pageを表示できる

## Files

- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `wrangler.jsonc`
- `vitest.config.ts`
- `playwright.config.ts`
- `src/shared/errors.ts`
- `src/infrastructure/db/*`
