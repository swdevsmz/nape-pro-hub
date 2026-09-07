---
id: "002"
title: "現行Nape ProでWebHID Read-only PoCを成立させる"
status: in_progress
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
  detect(): NapeDeviceInfo;
  readConfig(options?: ReadConfigOptions): Promise<RawNapeSnapshot>;
}
```

`sendWriteCommand`, `setConfig`, `importConfig`, `applyConfig` は作らない。

## Current Implementation

- `src/features/device-reader/domain/protocol.ts` にGET-only allowlistを実装
- `src/features/device-reader/infrastructure/webhid/webhid-transport.ts` にWebHID transportを実装
- 未検証Firmwareは通常フローで停止
- `/device-reader-poc` で明示操作時のみGET-onlyのまま未検証FWをprobe可能
- `/publish` の読み取り導線からPoCへ遷移可能

## Test Strategy

- [x] GET opcode allowlist外をprotocol guardが拒否する
- [x] SET/DELETE系opcodeを渡すテストが失敗する
- [x] Fake HID fixtureからLayer/Keymap/DPIを再現できる
- [ ] Chrome/Edge Desktopで実機接続できる
- [ ] 実機読取前後でLauncher上の設定が変わっていないことを確認する
- [x] 未対応Firmwareでは通常フローが安全に停止する

## Deliverables

- [x] `docs/dev/nape-hid-readonly-compatibility.md`
- [x] `src/features/device-reader/domain/*`
- [x] `src/features/device-reader/infrastructure/webhid/*`
- [x] `src/app/device-reader-poc/page.tsx`
- [ ] 現行実機fixture（実機確認後に秘密情報を除去して追加）

## Exit Criteria

最低限のRead Targetsが現行実機で取得できたらGO。

取得できない場合は、推測実装せずNo-Go理由と代替案を記録する。

## Local Smoke Note

WebHIDはSecure Context必須。`http://192.168.x.x:3000` ではなく、同一PCなら `http://localhost:3000/device-reader-poc` で確認する。
