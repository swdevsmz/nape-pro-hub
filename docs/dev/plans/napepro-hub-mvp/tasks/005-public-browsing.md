---
id: "005"
title: "公開画面と詳細表示を実装"
status: pending
priority: 2
dependencies: ["004"]
estimated_complexity: medium
---

# Task: 公開画面と詳細表示を実装

## Goal

トップ、新着、一覧、詳細、Googleユーザーのプロフィール、マイ投稿管理を実装する。

## Interfaces

```typescript
interface ConfigSummary { id: string; slug: string; catchphrase: string; authorName: string; likeCount: number; tags: string[] } // 🔵
interface ConfigDetail extends ConfigSummary { description?: string; attributes: ConfigAttributes; indexStatus: IndexStatus } // 🟡
```

## Test Strategy

- [ ] 未ログインでトップ/一覧/詳細を閲覧できる。
- [ ] hidden/deletedは公開面から404になる。
- [ ] レイヤー、DPI、Gesture等が人間向けに表示される。
- [ ] マイ投稿は本人のConfigだけを表示する。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:353-392, 632-713`
- Server Componentsで公開読み取りを行い、mutationだけclient interactionにする。

## Files

- 新規: `src/app/page.tsx`, `src/app/configs/page.tsx`, `src/app/configs/[id]/page.tsx`, `src/features/configs/ui/*`, `src/features/users/ui/*`
- テスト: `src/features/configs/ui/config-card.test.tsx`, `e2e/browsing.spec.ts`
