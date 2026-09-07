---
id: "002"
title: "現行Nape ProでWebHID Read-only PoCを成立させる"
status: pending
priority: 1
dependencies: ["001"]
estimated_complexity: high
---

# Task: 現行Nape ProでWebHID Read-only PoCを成立させる

## Goal

現在利用中のNape Pro実機を対象に、NapePro Hub自身のページからWebHID接続し、設定を一切変更せずに読み取れることを証明する。

このTaskはMVPの **Go / No-Go gate** とする。

## Research Inputs

- 現行Keychron Launcher UI: V1.4.8
- 既存非公式OSS: `dobachi/NapeProConfiguration`
- OSSの既知検証環境と現行実機にはFirmware/Launcher差分があるため、そのまま互換とみなさない

## Required Read Targets

最低限:

- Device識別
- Firmware version
- Layer count / layer indices
- Keymap
- Encoder
- DPI

可能なら:

- Orientation / OctaShift
- Gesture
- Combo
- Tap/Hold
- Device settings

## Safety Contract

```typescript
interface HidTransport {
  sendReadCommand(command: ReadCommand): Promise<Uint8Array>;
}

interface NapeDeviceReader {
  detect(): Promise<NapeDeviceInfo>;
  readConfig(onProgress?: (progress: ReadProgress) => void): Promise<RawNapeSnapshot>;
}
```

`sendWriteCommand`, `setConfig`, `importConfig`, `applyConfig` は作らない。

## Test Strategy

- [ ] GET opcode allowlist外をtransportが拒否する
- [ ] SET/DELETE系opcodeを渡すテストが失敗する
- [ ] Fake HID fixtureからLayer/Keymap/DPIを再現できる
- [ ] Chrome/Edge Desktopで実機接続できる
- [ ] 実機読取前後でLauncher上の設定が変わっていないことを確認する
- [ ] 未対応Firmwareでは安全に停止する

## Deliverables

- `docs/dev/nape-hid-readonly-compatibility.md`
- `src/features/device-reader/domain/*`
- `src/features/device-reader/infrastructure/webhid/*`
- `src/app/device-reader-poc/page.tsx`（PoC完了後に削除または開発専用化可）
- 実機fixture（秘密情報を含まない）

## Exit Criteria

最低限のRead Targetsが実機で取得できたらGO。

取得できない場合は、推測実装せずNo-Go理由と代替案を記録する。
