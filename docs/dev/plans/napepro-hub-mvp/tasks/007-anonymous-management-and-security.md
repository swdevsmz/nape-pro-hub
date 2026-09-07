---
id: "007"
title: "匿名投稿管理と最低限のセキュリティを実装"
status: pending
priority: 1
dependencies: ["004"]
estimated_complexity: medium
---

# Task: 匿名投稿管理と最低限のセキュリティを実装

## Goal

アカウントなしでも投稿できる利便性を維持しつつ、編集・削除・荒らし対策を最小構成で実装する。

## Scope

- Manage Token
- token hash保存
- PATCH / DELETE authorization
- Turnstile
- publish Rate Limit
- XSS / payload size validation
- hidden / deleted状態
- structured logging

## Non-scope

- OAuth
- user profile
- creator ranking
- like abuse detection

## Test Strategy

- [ ] 正しいManage Tokenで編集できる
- [ ] 誤Tokenで403になる
- [ ] Turnstile失敗を拒否する
- [ ] Rate Limitを超える投稿を拒否する
- [ ] token / raw IP / secretがログに出ない
