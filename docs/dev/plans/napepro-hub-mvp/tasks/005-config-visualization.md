---
id: "005"
title: "Launcher風の設定カード・詳細表示を実装"
status: pending
priority: 1
dependencies: ["004"]
estimated_complexity: high
---

# Task: Launcher風の設定カード・詳細表示を実装

## Goal

公開設定をJSONではなく、Nape Proの物理配置を中心とした独自UIで理解できるようにする。

## List Card

表示項目:

- title
- author（任意）
- usage tags
- placement（任意）
- firmware（小さく表示）
- 代表Layerの簡略デバイス図

カード内に全Layerを詰め込まない。

## Detail Page

- Nape Pro device diagram
- Layer switcher
- key assignments
- encoder
- DPI
- orientation
- gesture
- combos
- tap/hold
- unknown keycodes

## Design Rule

Keychron Launcherの情報構造は参考にするが、公式画像・CSS・アイコンをコピーしない。

## Test Strategy

- [ ] Layer切替でキー表示が更新される
- [ ] 人間可読keycode名を表示する
- [ ] unknown keycodeをraw値付きで表示する
- [ ] 狭い画面でも横崩れしない
- [ ] キーボード操作でLayerを切り替えられる
