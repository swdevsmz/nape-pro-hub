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

## Visual Direction

MVPの画面は、ユーザー承認済みモックを基準とする。

- ライトテーマを基本とする
- サイト背景は薄いグレー〜オフホワイト
- カードは白〜ごく薄いグレー
- カード境界は薄いボーダー + 弱いシャドウで明確にする
- 文字色は濃いグレー〜黒
- アクセントは紫
- サイドメニューは使わない
- ヘッダーはテキスト中心の軽量ナビゲーションにする
  - 設定一覧
  - 使い方
  - 公開する
- MVPではユーザー登録・マイページ・お気に入り等のナビゲーションを表示しない
- Chrome / Photoshop / ゲーム等のアプリアイコンは表示しない
- アプリや用途はテキストメタデータとして扱う

## List Card

一覧カードは「どのボタンに何を割り当てているか」が一目で分かることを最優先とする。

表示項目:

- title
- short description（任意）
- author（任意）
- usage / category text
- placement（任意）
- firmware（必要な場合のみ小さく表示）
- Layer
- DPI
- 代表LayerのNape Proデバイス図
- 主要キー割当のcallout label

カード例:

```text
Chromeを親指だけで操作
ブラウザ操作をもっと快適に

       戻る        Enter
         \          /
          [ Nape Pro ]
 左クリック   ●   上スクロール
                  下スクロール
                  右クリック

ブラウザ | Layer 0 | DPI 1200
```

カード内に全Layerを詰め込まない。

一覧では代表Layerのみ表示し、詳細でLayerを切り替える。

## Detail Page

主役は大きなNape Proデバイス図とキー割当calloutとする。

- title
- description
- category / usage text
- Layer / DPI
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

補助情報はカード下部にまとめ、デバイス図より目立たせない。

## Publish Page

画面を情報過多にしない。

基本フロー:

```text
1. 読み取り
2. 情報を入力
3. プレビュー
4. 公開
```

最上部に「Nape Proから設定を読み取る」を大きく配置する。

入力項目はMVPでは最小限:

- title（必須）
- description（任意）
- 対象アプリ / 用途（任意）

## Design Rule

Keychron Launcherの情報構造やデバイス中心の考え方は参考にするが、公式画像・CSS・アイコン・UIをコピーしない。

Nape Pro本体図もHub独自のSVG / CSS表現として実装する。

## Test Strategy

- [ ] 一覧カードだけで主要キー割当を確認できる
- [ ] 代表Layerのデバイス図がカード内で十分な大きさで表示される
- [ ] Layer切替でキー表示が更新される
- [ ] 人間可読keycode名を表示する
- [ ] unknown keycodeをraw値付きで表示する
- [ ] アプリアイコンに依存せず用途をテキストで表現できる
- [ ] サイドメニューなしで主要3画面へ移動できる
- [ ] ライトテーマで背景とカード境界を視認できる
- [ ] 狭い画面でも横崩れしない
- [ ] キーボード操作でLayerを切り替えられる
