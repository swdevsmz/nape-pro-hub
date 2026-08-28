---
id: "008"
title: "モデレーションと入力防御を実装"
status: pending
priority: 1
dependencies: ["004", "007"]
estimated_complexity: high
---

# Task: モデレーションと入力防御を実装

## Goal

Turnstile、Rate Limit、管理者allowlist、非公開化・再公開、監査ログ、全入力の境界検証を実装する。

## Interfaces

```typescript
interface ModerationService { hide(configId: string, adminId: string, reason: string): Promise<void>; restore(configId: string, adminId: string): Promise<void> } // 🟡
interface AbuseGuard { assertAllowed(actor: Actor, action: "publish" | "like" | "edit", turnstileToken?: string): Promise<void> } // 🔵
```

## Test Strategy

- [ ] Turnstile成功/失敗/token再利用を検証する。
- [ ] 投稿5件/時、Like60件/時、編集30件/時の制限を検証する。
- [ ] 非管理者の管理APIを403にし、操作が監査ログへ記録される。
- [ ] XSS、巨大JSON、秘密/IPのログ漏えいがない。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:984-1013`
- Rate Limit値は環境設定可能にし、ログはrequestIdとactor種別のみ残す。

## Files

- 新規: `src/app/admin/configs/page.tsx`, `src/app/api/admin/*`, `src/infrastructure/turnstile/*`, `src/infrastructure/rate-limit/*`, `src/features/moderation/*`
- テスト: `tests/workers/security.test.ts`, `e2e/moderation.spec.ts`
