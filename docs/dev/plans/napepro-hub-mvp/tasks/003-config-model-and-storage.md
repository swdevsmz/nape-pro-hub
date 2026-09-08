---
id: "003"
title: "Hub canonical modelとD1保存を実装"
status: in_progress
priority: 1
dependencies: ["002"]
estimated_complexity: medium
---

# Task: Hub canonical modelとD1保存を実装

## Goal

Firmware依存のraw snapshotをNapePro Hub内部形式へ正規化し、公開投稿としてD1へ安全に保存できるようにする。

## Interfaces

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
  encoders?: EncoderConfig[];
  gesture?: GestureConfig;
  combos?: ComboConfig[];
  tapHolds?: TapHoldConfig[];
  unknown?: UnknownDeviceValue[];
}
```

## Rules

- device layer indexとLauncher表示indexを混同しない
- 未知keycodeはraw値を保持する
- 取得できない項目を推測値で埋めない
- raw snapshotとcanonical modelのschema versionを分ける

## D1 Model

`configs` を中心に最小構成とする。

- id
- slug
- title
- description
- author_display_name
- usage_tags_json
- placement
- firmware_version
- hub_schema_version
- config_snapshot_json
- search_text
- status
- manage_token_hash
- created_at
- updated_at

## Current Implementation

- `src/features/config/domain/types.ts` にHub canonical modelを追加
- `src/features/config/domain/normalize-raw-snapshot.ts` でRaw snapshotからHub modelへ正規化
- keycodeを `rawCode / label / known` で保持し、未知値を `unknown` に残す
- Raw snapshotとHub configに独立したschema versionを付与
- `serializeHubConfig` / `deserializeHubConfig` で保存境界を追加
- 投稿メタデータとdecoded key assignmentから `search_text` を生成
- `migrations/0001-create-published-configs.sql` にD1初期schemaを追加
- Repository interfaceを追加し、D1/Drizzle実装をdomainから分離

### Remaining

- Drizzle ORM schema / D1 adapterの実装
- Cloudflare runtime bindingとの接続
- local D1 migrationの実行確認

Task 002の実機Go判定が未完了のため、実機依存項目は推測でcanonical modelへ追加しない。

## Test Strategy

- [x] fixtureからcanonical modelへ決定的に変換できる
- [x] unknown keycodeが消えない
- [x] serialize → deserializeで設定情報を失わない
- [ ] D1 migrationがlocalで成功する
