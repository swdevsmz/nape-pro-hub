# Plan: napepro-hub-mvp

## Requirements Summary

Nape Pro設定を共有する非公式ファンサイトMVPを構築する。

Phase 1は機能を絞り、**WebHIDによる実機Read Only取得 → Launcher風の独自可視化 → 匿名公開 → カード一覧 → 簡易検索** までを完成条件とする。

OAuth、Like、ランキング、AI検索、Vectorize、Queues、設定Import/ApplyはMVPから外す。

詳細: [requirements.md](requirements.md) | [user-stories.md](user-stories.md) | [acceptance-criteria.md](acceptance-criteria.md)

## MVP Product Statement

> みんなのNape Pro設定を見るサイト。
>
> 投稿者はNape Proをつないで「読み取る」を押し、タイトルを付けるだけ。

## Design Overview

### Frontend / Runtime

- Next.js 16 App Router
- TypeScript strict
- vinext
- Cloudflare Workers
- pnpm

### Data

- Cloudflare D1
- Drizzle ORM
- 1投稿 = 1 Hub Config snapshot

### Device integration

```text
Browser
  ↓ WebHID
Nape Pro
  ↓ GET only
Raw Device Snapshot
  ↓ normalize
NapeProHubConfig
  ↓ preview / publish
D1
```

WebHIDはブラウザ側のみで実行する。

### Read-only safety boundary

Readerのpublic APIは `readConfig()` 系だけにする。

```typescript
interface NapeDeviceReader {
  detect(): Promise<NapeDeviceInfo>;
  readConfig(onProgress?: (progress: ReadProgress) => void): Promise<NapeProHubConfig>;
}
```

書き込みAPIは定義しない。

低レベルHID transportはGET opcode allowlistを検証し、禁止opcodeを拒否する。

### Canonical model

Firmware依存のraw protocolとWeb表示用データを分離する。

```typescript
interface NapeProHubConfig {
  hubSchemaVersion: string;
  device: {
    model: "Keychron Nape Pro";
    firmwareVersion?: string;
  };
  layers: NapeLayer[];
  dpi?: DpiConfig;
  orientation?: OrientationConfig;
  encoder?: EncoderConfig[];
  gesture?: GestureConfig;
  combos?: ComboConfig[];
  tapHolds?: TapHoldConfig[];
  unknown?: UnknownDeviceValue[];
}
```

未知keycodeはraw値を保持する。

## UX

### `/`

- 検索欄
- Config cards
- 各カードに代表Layerの簡略デバイス図
- 「自分の設定を公開」導線

### `/configs/[id]`

- タイトル / 投稿者 / 説明 / タグ
- Nape Proデバイス図
- Layer切替
- DPI / Orientation / Encoder / Gesture / Combo / Tap-Hold概要

### `/publish`

```text
1. Nape ProをUSB接続
2. 「設定を読み取る」
3. WebHID許可
4. 読み取り進捗
5. Launcher風プレビュー
6. タイトル入力
7. 公開
```

## Search

MVPではD1の単純文字列検索とする。

対象:

- title
- description
- author
- usage tags
- decoded key assignment names
- layer summary

Semantic Searchは投稿数と検索ニーズを見てPhase 2以降で追加する。

## Routes

### Pages

- `/`
- `/configs/[id]`
- `/publish`

### API

- `POST /api/configs`
- `GET /api/configs`
- `GET /api/configs/[id]`
- `PATCH /api/configs/[id]`
- `DELETE /api/configs/[id]`

検索は `GET /api/configs?q=...` に統合してよい。

## Task Dependency Graph

```text
001
 ↓
002  WebHID Read-only PoC  ← Go / No-Go gate
 ↓
003  Canonical model + D1
 ↓
004  Read → Preview → Publish
 ↓
005  Card / Detail visualization
 ↓
006  Simple search
 ↓
007  Anonymous management + Security
 ↓
008  E2E + Cloudflare release
```

Task 002が実機で成立するまで、後続のデバイス依存実装を本格着手しない。

## Task Index

| ID | Task | Complexity | Dependencies |
|---|---|---|---|
| 001 | プロジェクト基盤を作成 | medium | - |
| 002 | 現行Nape ProでWebHID Read-only PoCを成立させる | high | 001 |
| 003 | Hub canonical modelとD1保存を実装 | medium | 002 |
| 004 | 実機読取から匿名公開までを実装 | high | 003 |
| 005 | Launcher風の設定カード・詳細表示を実装 | high | 004 |
| 006 | 簡易キーワード検索を実装 | low | 005 |
| 007 | 匿名投稿管理と最低限のセキュリティを実装 | medium | 004 |
| 008 | E2E・実機Smoke・Cloudflareリリースを完成 | high | 005,006,007 |

## Go / No-Go Gate: Task 002

Task 002で最低限、現行実機から以下を安全に取得できることを確認する。

- Device識別
- Firmware
- Layer / Keymap
- Encoder
- DPI

追加で安全に取得できる場合:

- Orientation
- Gesture
- Combo
- Tap/Hold
- Device settings

取得できない項目はMVP表示対象から外してよい。

**重要:** 読み取りPoCを成立させるためにSETコマンドを使用してはならない。

## Phase 2 Backlog

- JSON Import / Export互換
- Backup / Restore
- 設定Apply
- Config Diff
- Fork / Variant
- Like / Ranking
- Google/GitHub OAuth
- Creator profile
- Semantic Search
- AI tags
- Favorite
- Monetization

## Assumptions

- Keychron Launcherは設定理解のUI参考にするが、公式UIを複製しない。
- 非公式OSSの既存HID解析は参考情報であり、現行Firmwareで再検証する。
- WebHID非対応環境はMVPの投稿対象外とし、閲覧は全ブラウザで可能にする。
- サイト上の表記として「Keychron / Nape Proは各権利者の商標、本サイトは非公式ファンサイト」を明記する。
