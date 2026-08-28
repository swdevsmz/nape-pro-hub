---
id: "004"
title: "投稿・解析・非同期索引を実装"
status: pending
priority: 2
dependencies: ["002", "003"]
estimated_complexity: high
---

# Task: 投稿・解析・非同期索引を実装

## Goal

JSON投稿を受理し、検証・解析後にD1とQueueへ保存し、Workers AI/Vectorize成功時に公開する。

## Interfaces

```typescript
interface PublishConfig { execute(input: ConfigUploadInput, actor: Actor): Promise<{ id: string; slug: string; indexStatus: IndexStatus; editCode?: string }> } // 🔵
interface IndexJob { configId: string; revision: number; operation: "upsert" | "delete" } // 🟡
```

## Test Strategy

- [ ] multipart投稿が202と編集コードを返す。
- [ ] AI/Vectorize失敗が再試行され、古いrevisionが新しい索引を上書きしない。
- [ ] Queue成功後だけ初回Configがpublishedになる。
- [ ] PATCH/DELETEがCookieまたは編集コードで認可される。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:936-960`
- 初回はpending、更新は旧公開版を維持しながら新revisionを索引する。

## Files

- 新規: `src/app/api/configs/route.ts`, `src/app/api/configs/[id]/route.ts`, `src/features/configs/application/*`, `src/infrastructure/indexing/*`
- テスト: `tests/workers/publishing.test.ts`, `tests/workers/indexing.test.ts`
