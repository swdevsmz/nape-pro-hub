---
id: "003"
title: "D1認証と匿名所有権を実装"
status: pending
priority: 1
dependencies: ["001"]
estimated_complexity: high
---

# Task: D1認証と匿名所有権を実装

## Goal

Drizzle migration、Better AuthのGoogle OAuth、匿名Cookie、投稿別編集コード、排他的所有権の認可を実装する。

## Interfaces

```typescript
interface OwnershipService { authorize(configId: string, actor: Actor, editCode?: string): Promise<void> } // 🔵
interface AuthenticatedActor { kind: "user"; userId: string } // 🔵
interface AnonymousActor { kind: "anonymous"; anonymousUserId: string } // 🔵
```

## Test Strategy

- [ ] Google callbackでuser/sessionが作成される。
- [ ] Cookie所有者、正しい編集コードだけが編集/削除できる。
- [ ] 第三者、誤コード、期限切れsessionが403になる。
- [ ]編集コードとcredentialのhashのみがD1に保存される。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:816-895`
- Better Auth tablesとapp tablesを同一migration管理にする。user_id/anonymous_user_idは排他的制約にする。

## Files

- 新規: `src/db/schema.ts`, `drizzle/*.sql`, `src/infrastructure/auth/*`, `src/features/auth/*`, `src/features/configs/domain/ownership.ts`
- テスト: `tests/workers/ownership.test.ts`
