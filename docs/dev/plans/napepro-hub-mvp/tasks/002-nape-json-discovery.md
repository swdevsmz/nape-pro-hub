---
id: "002"
title: "Nape JSON仕様を調査しparser契約を確定"
status: pending
priority: 1
dependencies: ["001"]
estimated_complexity: high
---

# Task: Nape JSON仕様を調査しparser契約を確定

## Goal

実機エクスポート例と既存OSSから対応versionとデータ構造を確定し、未知versionを安全に拒否できるparser契約を作る。

## Interfaces

```typescript
interface ConfigParser { canParse(input: JsonValue): boolean; parse(input: JsonValue): ParsedNapeConfig } // 🔵設計書
interface ParsedNapeConfig { schemaVersion: string; attributes: ConfigAttributes; deterministicTags: string[]; searchText: string } // 🟡
```

## Test Strategy

- [ ] 正常版・旧版fixtureでレイヤー数、DPI、Gesture、Tap/Holdを抽出する。
- [ ] 破損、未知version、深すぎるJSON、1MiB超過を保存前に拒否する。
- [ ] 同一入力から同一attributes/tags/searchTextが生成される。

## Implementation Notes

- 参照: `docs/dev/napepro_service_design.md:262-303, 936-960`
- 実データを取得できない場合は推測実装せず、外部入力待ちとして報告する。

## Files

- 新規: `src/features/configs/domain/config-parser.ts`, `src/features/configs/domain/config-schema.ts`, `tests/fixtures/nape/*.json`
- テスト: `src/features/configs/domain/config-parser.test.ts`
