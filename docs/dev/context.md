# プロジェクトコンテキスト

> 最終更新: 2026-09-08
> 本文書は `docs/dev/plans/napepro-hub-mvp/` の現行MVP計画に従う。
> `docs/dev/napepro_service_design.md` は長期ビジョンとして残し、MVP範囲について矛盾する記述がある場合は本コンテキストとMVP計画を優先する。

## 現在のプロダクト方針

NapePro Hub は **Nape Proユーザーが自分の設定を読み取り、見やすい形で公開し、他のユーザーが一覧・検索できる非公式ファンサイト** とする。

MVPの価値は次の3点に絞る。

1. Nape Proをブラウザから **読み取り専用** で接続できる
2. 読み取った設定を **Keychron Launcherの情報量を参考にした独自UI** で可視化できる
3. 公開された設定をカード一覧と簡易検索で探せる

MVPでは、設定のImport・実機書き込み、OAuth、Like、ランキング、AI検索、Vector Search、広告機能を実装しない。

## 技術スタック

| 分類 | 採用内容 |
|---|---|
| 言語 | TypeScript（strict） |
| 開発/CIランタイム | Node.js 24 LTS |
| フレームワーク | Next.js 16 App Router + vinext |
| 本番ランタイム | Cloudflare Workers |
| ホスティング | Cloudflare |
| パッケージマネージャ | pnpm |
| DB | Cloudflare D1 + Drizzle ORM |
| 実機読取 | WebHID（ブラウザ側、GET系コマンドのみ） |
| 投稿防御 | Cloudflare Turnstile + Rate Limit |
| テスト | Vitest / React Testing Library / Playwright / Cloudflare Vitest |

### MVPで使わないもの

- Better Auth / Google OAuth
- Cloudflare Queues
- Workers AI
- Vectorize
- Embedding
- Like / Ranking用集計基盤

これらはPhase 2以降で必要性を再評価する。

## 重要な設計原則

### 1. WebHIDはRead Only

MVPのブラウザコードはNape Proへ設定を書き込まない。

- 読み取りに必要なGET系コマンドだけを明示的なallowlistで許可する
- SET / DELETE / SAVE相当の書き込みコマンドはAPIとして公開しない
- 低レベルHID transportにも書き込み系opcodeを渡せないガードを置く
- 実機PoCで現在のFirmwareに対する読み取り互換性を確認してから本実装へ進む

### 2. 推測でプロトコルを実装しない

既存OSS `dobachi/NapeProConfiguration` は重要な参考資料だが、非公式かつ検証済みFirmware/Launcherに差がある。

MVPは以下を実機で確認する。

- Device識別
- Firmware取得
- Layer数
- Keymap
- Encoder
- DPI
- Orientation / OctaShift
- Combo
- Tap/Hold
- Gesture
- その他、現行Firmwareで安全に読める設定

現在のデバイスで読めない項目は、推測で補完しない。

### 3. Hub内部形式を持つ

外部JSON形式や特定Firmwareの通信形式をDBの正規モデルにしない。

```text
WebHID Reader
    ↓
Raw Device Snapshot
    ↓
NapeProHubConfig
    ↓
D1 / UI / Search
```

未知キーコードは破棄せず、raw codeを保持する。

### 4. Launcherをコピーしない

Keychron Launcherの画面は、情報構造と操作理解の参考にする。

- Nape Pro本体を中心にキー割当が見える
- Layerを切り替えられる
- DPI / Gesture / Combo / Tap-Hold等を人間向けに表示する

ただし、公式UIの画像・アイコン・CSSを複製せず、NapePro Hub独自のカード・詳細UIとして実装する。

## MVP画面

```text
/
  公開設定一覧 + 検索

/configs/[id]
  設定詳細 + Layer切替 + 設定概要

/publish
  Nape Pro接続 → 読み取り → プレビュー → タイトル入力 → 公開
```

MVPでは独立した `/search`、`/rankings`、`/creators`、`/users`、`/login`、`/me` を作らない。

## データの基本形

### configs

```text
id
slug
title
description nullable
author_display_name nullable
usage_tags_json
placement nullable
firmware_version nullable
hub_schema_version
config_snapshot_json
search_text
status
manage_token_hash
created_at
updated_at
```

MVPでは1投稿=1設定スナップショットとする。

## 検紺

MVPはD1上の単純検索で十分とする。

検索対象:

- title
- description
- author_display_name
- usage tags
- デコード済みキー割当名
- Layer概要

AI・Embedding・Vectorizeは使わない。

## テスト方針

| 層 | 内容 |
|---|---|
| Unit | parser、canonical model、keycode decode、GET command allowlist |
| Component | Config card、device diagram、Layer switcher、publish preview |
| Workers integration | D1保存、一覧、検索、匿名管理token、Turnstile境界 |
| E2E | 読取モック → プレビュー → 公開 → 一覧 → 詳細 → 検索 |
| Manual smoke | 実機Nape ProをChrome/Edge Desktopから読み取る |

WebHID実機試験はCIでは再現できないため、低レベルReaderをinterface化しfixture/mockで自動テストする。

## MVP完了条件

- 現行Nape Pro実機から設定を読み取れる
- 読み取り処理が設定を書き込まないことをコードとテストで担保できる
- 読み取った内容をLayer単位で視覚表示できる
- タイトルを付けて匿名公開できる
- 公開設定をカード一覧で見られる
- キーワードで検索できる
- 非対応ブラウザ/未知Firmwareで安全に失敗する
- Cloudflareへデプロイできる

## Phase 2候補

- JSON Import / Export互換
- Nape Proへの安全な設定適用
- 設定Diff / Backup / Restore
- Fork / Variant
- Like / Ranking
- OAuth / Creator profile
- Semantic Search
- お気に入り
- 広告 / アフィリエイト
