# Nape Pro WebHID Read-only Compatibility

最終更新: 2026-09-08

## 目的

NapePro Hub MVPでは、Nape Proの設定を**読み取るだけ**に限定する。

設定のImport / Apply / SET / DELETE / SAVEはMVPに含めない。

## 根拠

既存の非公式OSS `dobachi/NapeProConfiguration` が解析した以下の環境を初期プロトコル根拠とする。

- Keychron Launcher V1.3.8
- Nape Pro Firmware v1.2.3-ZK
- Nape Pro Firmware v1.2.5-ZK

NapePro Hubはこの解析結果を参考にするが、現行Firmwareで同じ仕様が維持されているとは仮定しない。

## 現在のRead-only allowlist

NapePro HubのWebHID transportは、以下のGET系コマンドだけを送信可能にする。

| 用途 | Packet |
|---|---|
| Firmware | `[0xA1]` |
| Keymap | `[0x04, layer, 0, col]` |
| Encoder | `[0x14, layer, 0, dir]` |
| Global orientation | `[0xA7, 0x20]` |
| Current DPI level | `[0xA7, 0x21]` |
| DPI level value | `[0xA7, 0x24, level]` |
| Layer orientation | `[0xA7, 0x38, layer]` |

それ以外はtransport層で拒否する。

特に以下は送信不可。

- VIA SET keycode `0x05`
- VIA SET buffer `0x13`
- VIA SET encoder `0x15`
- Nape SET_DPI `0xA7 0x22`
- Nape SET_DPI_VALUE `0xA7 0x23`
- SET_TAPHOLDS / SET_COMBOS / SET_GESTURE
- SET_LAYER
- DEL_COMBOS / DEL_TAPHOLDS
- SET_ORI / SET_LAYER_ORI

## Firmware判定

自動読み取りを検証済み扱いするのは現時点で以下だけ。

- v1.2.3-ZK
- v1.2.5-ZK
- 同等の数値形式 010203 / 010205

それ以外は通常フローで停止する。

開発用 `/device-reader-poc` では、利用者が明示的に操作した場合に限り、**GET-only allowlistを維持したまま**未検証Firmwareで読み取りを試せる。

この結果を使って現行Firmwareとの互換性を確認する。

## Secure Context

WebHIDはSecure Contextでのみ利用できる。

開発時:

- ✅ `http://localhost:3000`
- ✅ HTTPSの開発URL
- ❌ `http://192.168.x.x:3000` のようなLAN IPへの平文HTTPアクセス

LAN内の別端末から試す場合はHTTPS化する。

## 実機検証チェックリスト

- [ ] Chrome / Chromium系Desktopで `navigator.hid` が利用可能
- [ ] Nape ProをUSB Modeで接続
- [ ] usagePage `0xFF60` の設定通信用HIDを選択できる
- [ ] Firmware文字列を取得できる
- [ ] Layer 0〜8 / Key col 0〜6を取得できる
- [ ] Encoder CCW/CWを取得できる
- [ ] DPI current level / 5 levelsを取得できる
- [ ] Orientationを取得できる、またはoptional readとして安全に失敗する
- [ ] 読み取り前後でKeychron Launcher上の設定が変化していない

## 現行FW検証結果

未検証。

最初の実機テスト結果をここへ追記する。
