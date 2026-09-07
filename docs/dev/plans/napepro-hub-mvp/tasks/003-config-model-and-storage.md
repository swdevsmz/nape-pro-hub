---
id: "003"
title: "Hub canonical modelとD1保存を実装"
status: pending
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

## Test Strategy

- [ ] fixtureからcanonical modelへ決定的に変換できる
- [ ] unknown keycodeが消えない
- [ ] serialize → deserializeで設定情報を失わない
- [ ] D1 migrationがlocalで成功する
