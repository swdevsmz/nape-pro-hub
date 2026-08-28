---
id: "011"
title: "Cloudflare previewとリリース品質ゲートを整備"
status: pending
priority: 1
dependencies: ["009", "010"]
estimated_complexity: high
---

# Task: Cloudflare previewとリリース品質ゲートを整備

## Goal

Cloudflare preview/deploy手順、migration、compatibility check、CI必須チェック、監視とrollback手順を完成させる。

## Interfaces

```typescript
interface ReleaseCheck { lint: "pass" | "fail"; typecheck: "pass" | "fail"; tests: "pass" | "fail"; build: "pass" | "fail"; compatibility: "pass" | "fail" } // 🟡
```

## Test Strategy

- [ ] CIでinstall(lockfile固定)→lint→typecheck→unit→Workers integration→build→E2Eが実行される。
- [ ] `vinext check`とWorkers previewが成功する。
- [ ] D1 migrationを新規DBと既存fixture DBへ適用できる。
- [ ] Queue失敗、Vectorize削除、管理者hiddenの復旧手順を検証する。

## Implementation Notes

- 参照: `docs/dev/context.md`のBuild & Run、`docs/dev/napepro_service_design.md:785-812`
- デプロイ先・OAuth/Turnstile secretは環境変数/Cloudflare secretsで管理し、リポジトリへ入れない。

## Files

- 新規: `.github/workflows/ci.yml`, `scripts/verify-release.ts`, `docs/operations/rollback.md`, `docs/operations/cloudflare.md`
- 変更: `package.json`, `wrangler.jsonc`, `drizzle/*`
- テスト: `tests/release/*.test.ts`
