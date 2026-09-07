---
id: "008"
title: "E2E・実機Smoke・Cloudflareリリースを完成"
status: pending
priority: 1
dependencies: ["005", "006", "007"]
estimated_complexity: high
---

# Task: E2E・実機Smoke・Cloudflareリリースを完成

## Goal

MVPの主要導線を自動・手動の両方で検証し、Cloudflare productionへ安全にリリースできる状態にする。

## Automated E2E

ReaderはWebHID mockを注入して検証する。

```text
mock device
  ↓
/publish
  ↓
read preview
  ↓
publish
  ↓
list
  ↓
detail / layer switch
  ↓
search
  ↓
edit / delete
```

## Manual Device Smoke

現行Nape Pro実機で:

- WebHID permission
- firmware read
- layer/keymap read
- DPI/encoder read
- 追加対応項目read
- 設定が変化していないことをLauncherで確認

## Release Checks

- lint
- typecheck
- unit
- Workers integration
- Playwright
- build
- vinext check
- Cloudflare preview
- D1 migration
- real-device read-only smoke

## Operational Docs

- supported browser
- known firmware compatibility
- WebHID troubleshooting
- rollback
- unofficial fan-site / trademark notice
