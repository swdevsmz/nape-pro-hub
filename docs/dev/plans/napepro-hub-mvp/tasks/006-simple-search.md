---
id: "006"
title: "簡易キーワード検索を実装"
status: pending
priority: 2
dependencies: ["005"]
estimated_complexity: low
---

# Task: 簡易キーワード検索を実装

## Goal

トップページの検索欄から、用途・アプリ名・キー割当名で公開設定を探せるようにする。

## Search Targets

- title
- description
- author_display_name
- usage tags
- placement
- decoded key assignment names
- layer summary

## Implementation

MVPではEmbedding / Workers AI / Vectorizeを使用しない。

投稿保存時に検索用の正規化文字列 `search_text` を生成し、D1で検索する。

## Test Strategy

- [ ] `Chrome` でタイトル/説明一致を取得できる
- [ ] `Enter` でキー割当一致を取得できる
- [ ] `縦置き` でtag/placement一致を取得できる
- [ ] hidden/deletedを除外する
- [ ] 空検索で通常一覧を返す
