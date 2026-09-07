---
id: "004"
title: "実機読取から匿名公開までを実装"
status: pending
priority: 1
dependencies: ["003"]
estimated_complexity: high
---

# Task: 実機読取から匿名公開までを実装

## Goal

`/publish` でNape Proを読み取り、設定プレビューを確認し、タイトルを付けて匿名公開できる一連の体験を完成させる。

## User Flow

```text
Nape Pro接続
  ↓
設定を読み取る
  ↓
WebHID permission
  ↓
読み取り進捗
  ↓
設定プレビュー
  ↓
タイトル入力
  ↓
公開
  ↓
/configs/[id]
```

## Input

必須:

- Hub Config
- title 1〜80文字

任意:

- author display name
- description
- usage tags
- placement

## Interfaces

```typescript
interface PublishConfigInput {
  config: NapeProHubConfig;
  title: string;
  description?: string;
  authorDisplayName?: string;
  usageTags?: string[];
  placement?: string;
}
```

## Test Strategy

- [ ] Reader mockからプレビューまで表示できる
- [ ] titleだけで投稿できる
- [ ] 投稿後に詳細URLへ遷移する
- [ ] 破損payload / oversized payloadを拒否する
- [ ] Manage Tokenを発行しhashだけ保存する
