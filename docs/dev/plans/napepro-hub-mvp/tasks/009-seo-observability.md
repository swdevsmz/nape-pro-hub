---
id: "009"
title: "SEO計測とアクセシビリティを実装"
status: pending
priority: 3
dependencies: ["005", "006", "007", "008"]
estimated_complexity: medium
---

# Task: SEO計測とアクセシビリティを実装

## Goal

公開詳細のmetadata/OGP/canonical/sitemap/robots/JSON-LD、KPIイベント、構造化ログ、主要導線のアクセシビリティを整備する。

## Interfaces

```typescript
interface AnalyticsSink { track(event: "view" | "search" | "like" | "publish", properties: Record<string, string | number>): Promise<void> } // 🟡
```

## Test Strategy

- [ ] 公開Configだけがsitemap/JSON-LDに出る。
- [ ] view/search/like/publishが秘密情報なしで記録される。
- [ ] キーボード操作とaxe検査で重大違反がない。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:1015-1047, 1147-1179`
- 広告・アフィリエイト枠は作らない。イベントは匿名化し、raw IPを保存しない。

## Files

- 新規: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/shared/analytics/*`, `src/shared/seo/*`
- テスト: `e2e/seo.spec.ts`, `e2e/accessibility.spec.ts`
