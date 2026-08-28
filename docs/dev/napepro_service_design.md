# Nape Pro 設定共有サービス 設計書

## 1. 概要

### 1.1 サービスの目的

Nape Pro ユーザーが、自分の設定を気軽に公開・共有し、他のユーザーが自分の用途に合う設定を発見できるサービスを構築する。

単なる「設定ファイル置き場」ではなく、以下を備えた **Nape Pro 設定の発見・共有プラットフォーム** を目指す。

- Nape Pro 設定の投稿・共有
- 自然文によるセマンティック検索
- いいねによる評価
- 人気設定ランキング
- 人気投稿者ランキング
- 匿名投稿とアカウント投稿の両立
- 将来的な Nape Pro 実機からの設定取得・適用
- ガジェット系広告・アフィリエイトによるマネタイズ

---

## 2. サービスコンセプト

### 2.1 コンセプト

> あなたに合った Nape Pro 設定が見つかる。

ユーザーは「どのキーに何を割り当てたか」ではなく、

- Chrome を左手だけで操作したい
- Excel 作業を速くしたい
- VS Code で使いやすい設定が欲しい
- 動画編集向けの設定を探したい
- ブラウジングに向いた設定を見たい

といった **目的・用途ベース** で設定を探せる。

### 2.2 サービスの位置づけ

掲示板の気軽さと、設定共有サービスの構造化された情報を組み合わせる。

特に重要なのは、投稿者に大量の入力を要求しないこと。

原則として、

1. Nape Pro の設定を読み込む
2. キャッチコピーを付ける
3. 公開する

だけで投稿できる体験を目指す。

---

## 3. UX の基本方針

### 3.1 「ユーザー登録」を入口にしない

ユーザー登録は必須にしない。

閲覧・検索・投稿・いいねは、ログインしていなくても利用できる。

アカウント登録は、ユーザーが必要になったときに行う。

### 3.2 基本思想

**登録してから使うのではなく、使ってから必要なら登録する。**

匿名利用者でもサービスの主要機能を利用できるようにする。

### 3.3 UI 上の用語

「設定を登録する」よりも、以下を優先する。

- 設定を公開する
- 自分の設定を公開
- 設定を探す

会員制サイトの印象を弱め、掲示板のような気軽さを維持する。

---

## 4. 匿名ユーザーと登録ユーザー

### 4.1 基本方針

未ログイン状態でも設定を投稿できる。

ログインしている場合は、投稿がそのユーザーアカウントに紐づく。

### 4.2 機能比較

| 機能 | 匿名 | 登録ユーザー |
|---|---:|---:|
| 設定閲覧 | ○ | ○ |
| セマンティック検索 | ○ | ○ |
| 設定投稿 | ○ | ○ |
| いいね | ○ | ○ |
| 人気設定ランキング | ○ | ○ |
| 投稿編集 | ○ ※編集キー等 | ○ |
| 投稿削除 | ○ ※編集キー等 | ○ |
| 投稿履歴 | △ | ○ |
| プロフィール | × | ○ |
| 人気投稿者ランキング | × | ○ |
| お気に入り管理 | × | ○ |
| 複数端末からの投稿管理 | × | ○ |

### 4.3 匿名投稿

匿名ユーザーは、会員登録なしでそのまま投稿できる。

投稿時の入力項目は最小限とする。

例:

```text
Nape Pro 設定を読み込む

キャッチコピー
[ Chrome 操作を左手だけで完結 ]

投稿者名（任意）
[ nape初心者 ]

説明（任意）
[                              ]

[ 公開する ]
```

投稿者名が空欄の場合は「匿名」と表示する。

### 4.4 匿名投稿の編集・削除

匿名投稿には編集用の秘密情報を持たせる。

候補:

- 投稿時に編集キーを発行
- ブラウザの Cookie / localStorage に匿名投稿者 ID を保存
- 必要に応じて編集キーを入力

例:

```text
投稿しました

編集・削除コード
AB39-X72K

このコードは後から変更・削除するときに必要です。
```

MVP では、

- ブラウザに匿名投稿者 ID を保存
- 投稿完了時に編集キーを表示

の併用を推奨する。

### 4.5 匿名投稿からアカウントへの移行

匿名で投稿した後、アカウント登録したユーザーが、自分の匿名投稿をアカウントへ紐付けられるようにする。

例:

```text
この設定を自分のアカウントで管理

[ Google で続ける ]
[ GitHub で続ける ]
```

これにより、

- 投稿履歴
- いいね数
- ランキング実績

を引き継げる。

---

## 5. アカウント

### 5.1 認証方式

MVP では OAuth を中心とする。

候補:

- Google
- GitHub

メールアドレス + パスワード方式は初期段階では不要。

### 5.2 登録ユーザーのメリット

登録ユーザーは以下を利用できる。

- 投稿の編集・削除
- 自分の投稿一覧
- プロフィール
- 合計いいね数
- 人気投稿者ランキング
- 複数端末からの投稿管理
- 将来的なお気に入り管理
- 匿名投稿のアカウント引き継ぎ

### 5.3 プロフィール例

```text
shimizu

公開設定 8件
合計 いいね 1,284

人気設定

Chrome 操作を全部左手に
❤️ 841

VS Code 開発用
❤️ 624
```

---

## 6. 設定投稿

### 6.1 投稿時の必須項目

最小限の入力とする。

必須:

- Nape Pro 設定データ
- キャッチコピー

任意:

- 投稿者名（匿名投稿時）
- 説明
- 用途
- タグ

ただし、JSON から解析できる情報はユーザーに入力させない。

### 6.2 キャッチコピー

一覧で最も重要な情報として扱う。

例:

- Chrome 操作を全部左手に集約
- Excel 作業が爆速になる Nape Pro
- 右手はマウス、左手は Nape Pro
- VS Code コーディング特化
- Premiere Pro 編集用構成

設定値そのものよりも、「何ができる設定なのか」を伝える。

### 6.3 設定 JSON から自動抽出する情報

Nape Pro 設定データから可能な限り自動抽出する。

例:

- キーマップ
- レイヤー
- レイヤー数
- エンコーダー
- DPI
- Gesture
- Tap / Hold
- Combo
- Scroll
- Orientation
- Firmware Version
- Launcher Version
- その他設定項目

### 6.4 自動タグ生成

JSON 解析および AI により内部タグを生成する。

例:

```text
ブラウザ
仕事
コーディング
左手操作
3レイヤー
Gesture
Tap/Hold
DPI 1600
Chrome
VS Code
```

投稿者に大量のタグ入力を要求しない。

---

## 7. Nape Pro 設定取得

### 7.1 初期方針

MVP では、まず JSON ファイルのアップロードをサポートする。

```text
[ JSON を選択 ]
```

### 7.2 将来方針

WebHID を利用して、ブラウザから直接 Nape Pro に接続する。

理想的なフロー:

```text
[ Nape Pro を接続 ]

↓ ブラウザが HID 接続許可を表示

Nape Pro の設定を自動取得

↓

キャッチコピー入力

↓

[ 公開する ]
```

### 7.3 WebHID 実装上の注意

既存の Nape Pro 設定バックアップ系 OSS では、Nape Pro の設定を JSON 化する実装例が存在する。

ただし、

- Firmware バージョン差異
- Launcher バージョン差異
- HID プロトコル差異

があるため、実機 PoC を先に行う。

最初は **読み取り専用** とし、Nape Pro 本体へ設定を書き込む機能は後続フェーズにする。

---

## 8. 設定詳細ページ

設定詳細では、JSON をそのまま表示するだけではなく、人間が理解しやすい形に変換する。

例:

```text
Chrome 操作を全部左手に集約

by shimizu

❤️ 132
👁 1,248 views

用途
Chrome / Browser / Work

DPI
1600

Layer 0
┌──────┬──────┬──────┐
│ 戻る │ 進む │ Scroll │
└──────┴──────┴──────┘

Layer 1
...

Gesture
有効

Tap/Hold
有効

[ この設定を使う ]  ※将来
```

---

## 9. セマンティック検索

### 9.1 基本方針

キーワード完全一致検索を中心にしない。

ユーザーは自然文で検索する。

検索ボックスの文言例:

> どんな設定を探していますか？

検索例:

- Chrome を左手で操作したい
- Excel 仕事向け
- 動画編集向け
- VS Code で使いやすい
- ブラウジングで便利
- 左手だけで完結したい

### 9.2 検索対象テキスト

キャッチコピーだけを Embedding しない。

投稿データをもとに、検索専用の文章を生成する。

例:

```text
タイトル:
ブラウザ操作を左手だけで完結

説明:
Chrome や Edge などブラウザ操作を効率化する設定。

用途:
ブラウジング
仕事
コーディング

操作:
戻る
進む
スクロール
タブ切替
コピー
ペースト

特徴:
左手操作
3レイヤー
Gesture 使用
Tap/Hold 使用
DPI 1600
```

この文章を Embedding する。

### 9.3 検索ランキング

検索順位は Semantic Similarity を最重要とする。

初期案:

```text
Semantic similarity  85%
Popularity            10%
Freshness               5%
```

人気度を強くしすぎない。

新しい投稿が検索結果に露出しなくなるのを防ぐ。

### 9.4 検索結果を広くする

「関連をなるべく広く拾う」ことを重視する。

Vector Search から候補を多めに取得する。

例:

- Top 30
- Top 50

その後、アプリ側でスコアリングして並べ替える。

### 9.5 将来的な検索クエリ展開

Phase 2 以降で AI による検索文の展開を検討する。

例:

```text
ユーザー:
仕事で便利

内部展開:
仕事
業務効率化
オフィスワーク
Excel
ブラウザ
ショートカット
コピー
ペースト
タブ切替
```

複数検索結果を統合して検索精度を上げる。

### 9.6 フィルター

セマンティック検索と組み合わせてフィルターを提供する。

候補:

- アプリ
- 用途
- レイヤー数
- Gesture 有無
- Tap/Hold 有無
- DPI
- Orientation
- Firmware Version

---

## 10. いいね

### 10.1 基本方針

匿名ユーザーでもいいね可能とする。

ログインを強制しない。

### 10.2 匿名ユーザー

匿名ユーザー ID と設定 ID の組み合わせで重複を防ぐ。

```text
anonymous_user_id + config_id
```

### 10.3 登録ユーザー

```text
user_id + config_id
```

### 10.4 不正対策

MVP では完全な不正防止を目指さない。

最低限:

- 同一 ID による連打防止
- Rate Limit
- Cloudflare Turnstile
- Bot 対策

サービス規模が拡大したら、ランキング不正対策を強化する。

---

## 11. ランキング

### 11.1 人気設定ランキング

期間別で表示する。

- 今日
- 今週
- 今月
- 歴代

トップページでは「今週人気」を中心とする。

例:

```text
🔥 今週人気

1. Chrome 操作を全部左手に  ❤️324
2. Excel 爆速セット          ❤️287
3. Blender 左手デバイス      ❤️244
```

### 11.2 人気投稿者ランキング

登録ユーザーのみ対象。

名称は「ユーザーランキング」よりも、

> 人気投稿者

または

> 人気クリエイター

とする。

集計:

```text
そのユーザーが投稿した設定の合計 Like 数
```

例:

```text
🏆 今月の人気投稿者

1. shimizu       ❤️ 2,834
2. nape_master   ❤️ 1,932
3. yuki          ❤️ 1,482
```

### 11.3 将来指標

いいね以外にも以下を計測する。

- View
- Like
- 設定ダウンロード
- 設定コピー
- 設定適用

最終的には「実際に使われている設定」を評価できるようにする。

将来ランキング候補:

- 人気
- よく使われている
- 話題
- 新着

---

## 12. トップページ

トップページ案:

```text
────────────────────────────

NapePro Hub

あなたに合った
Nape Pro 設定を見つけよう。

[ どんな設定を探していますか？ ]

例:
「Chromeを左手で操作したい」
「Excel仕事向け」
「動画編集向け」

────────────────────────────

🔥 今週人気の設定

[ Card ] [ Card ] [ Card ]

────────────────────────────

✨ 新着設定

[ Card ] [ Card ] [ Card ]

────────────────────────────

🏆 人気投稿者

1. shimizu       ❤️2834
2. nape_master   ❤️1932
3. yuki          ❤️1482

────────────────────────────

あなたの設定も公開しよう

[ Nape Pro から読み込む ]
[ JSON をアップロード ]

────────────────────────────
```

---

## 13. 設定カード

設定一覧・検索結果ではカード形式で表示する。

例:

```text
┌─────────────────────────────┐

Chrome 操作を全部左手に集約

by shimizu
❤️ 132

Browser / Work / 3 Layers

[ 設定を見る ]

└─────────────────────────────┘
```

カードで重要な順番:

1. キャッチコピー
2. 投稿者
3. いいね数
4. 用途・主要特徴
5. 詳細への導線

---

## 14. マネタイズ

### 14.1 基本方針

ガジェット好きのユーザーが集まるサイトとして、ガジェット系広告との親和性を活かす。

### 14.2 広告

候補:

- ディスプレイ広告
- ガジェット系スポンサー広告
- PC 周辺機器広告

### 14.3 アフィリエイト

広告だけでなく、ガジェット紹介によるアフィリエイトを重視する。

対象例:

- キーボード
- マウス
- USB-C ケーブル
- モニター
- モニターアーム
- デスクマット
- トラックボール
- 左手デバイス
- Nape Pro 関連製品

### 14.4 将来的な「使用ガジェット」

登録ユーザーが使用しているガジェットを登録できるようにする。

例:

```text
使用ガジェット

MX Master 3S
Keychron K3
Nape Pro
```

導線:

```text
設定を見る
↓
投稿者のデスク・ガジェットを見る
↓
商品ページ
```

広告収益だけでなく、アフィリエイト収益につなげる。

---

## 15. 技術構成

### 15.1 フロントエンド

- Next.js
- TypeScript

### 15.2 ホスティング

- Cloudflare

Next.js の Cloudflare 配備方法については、実装開始時点の最新推奨構成を確認して採用する。

### 15.3 Cloudflare 構成案

```text
Browser
  |
  v
Next.js
Cloudflare Workers
  |
  +-------------------+--------------------+
  |                   |                    |
  v                   v                    v
Cloudflare D1     Workers AI           Vectorize
  |                   |                    |
Users              Embedding          Semantic Search
Configs
Likes
Tags
Ranking
```

### 15.4 利用候補サービス

- Cloudflare Workers
- Cloudflare D1
- Cloudflare Vectorize
- Cloudflare Workers AI
- Cloudflare Turnstile

---

## 16. データモデル

### 16.1 users

```text
users

id
display_name
avatar_url
provider
provider_user_id
bio
created_at
updated_at
```

### 16.2 anonymous_users

```text
anonymous_users

id
secret_hash
created_at
last_seen_at
```

ブラウザ側には匿名ユーザー識別情報を保持する。

### 16.3 configs

```text
configs

id
user_id nullable
anonymous_user_id nullable

catchphrase
author_display_name nullable
description nullable

config_json
search_text

firmware_version
launcher_version
layer_count
dpi
orientation

like_count
view_count

status

created_at
updated_at
```

`user_id` と `anonymous_user_id` はどちらか一方を保持する。

匿名投稿をユーザーアカウントへ移行した場合は、`user_id` に付け替える。

### 16.4 likes

```text
likes

id
config_id

user_id nullable
anonymous_user_id nullable

created_at
```

重複防止制約を設ける。

### 16.5 tags

```text
tags

id
name
slug
```

### 16.6 config_tags

```text
config_tags

config_id
tag_id
```

### 16.7 vector data

Vectorize 上では以下を基本とする。

```text
vector_id = config.id
```

metadata 候補:

- application
- layer_count
- gesture
- tap_hold
- firmware_version
- orientation
- published_at

---

## 17. 投稿処理フロー

### 17.1 JSON 投稿

```text
ユーザー
↓
JSON アップロード
↓
JSON Schema / Version 検証
↓
Nape Pro 設定解析
↓
設定情報抽出
↓
検索用テキスト生成
↓
Embedding 生成
↓
D1 保存
↓
Vectorize 保存
↓
公開
```

### 17.2 WebHID 投稿

```text
ユーザー
↓
Nape Pro 接続
↓
WebHID Permission
↓
設定読み取り
↓
JSON 化
↓
設定解析
↓
キャッチコピー入力
↓
公開
```

---

## 18. セキュリティ・荒らし対策

匿名投稿を許可するため、最低限の対策を入れる。

### MVP

- Cloudflare Turnstile
- IP / Session ベース Rate Limit
- 連続投稿制限
- 連続 Like 制限
- JSON サイズ上限
- JSON Schema 検証
- XSS 対策
- HTML サニタイズ
- 説明文の文字数制限
- キャッチコピー文字数制限
- 投稿削除機能
- 管理者による非公開化

### 将来

- 通報機能
- NG ワード
- Spam Score
- Reputation
- 不正 Like 検出
- BAN
- Soft Delete

---

## 19. SEO

設定ページは個別 URL を持たせる。

例:

```text
/configs/chrome-left-hand-xxxx
```

ページには以下を含める。

- キャッチコピー
- 説明
- 用途
- Nape Pro 設定概要
- 投稿者
- 関連設定
- いいね数

セマンティック検索だけでなく、Google 等から、

- Nape Pro Chrome 設定
- Nape Pro Excel 設定
- Nape Pro おすすめ設定
- Nape Pro 左手
- Nape Pro VS Code

などで流入できる構造にする。

---

## 20. 関連設定

設定詳細ページ下部に、Vector Search を利用して「似た設定」を表示する。

例:

```text
この設定に似ています

Chrome 左手操作
ブラウザ特化
VS Code + Chrome
```

検索機能だけでなく回遊性向上にも Vectorize を利用する。

広告収益を考えるうえでも、1 セッションあたりの閲覧ページ数を増やす重要な機能となる。

---

## 21. MVP

### Phase 1

まず公開する機能。

- Next.js + Cloudflare
- 設定一覧
- 設定詳細
- JSON アップロード
- 匿名投稿
- OAuth ユーザー登録
- 登録ユーザー投稿
- キャッチコピー
- 説明
- 設定 JSON 解析
- 自動タグ
- セマンティック検索
- いいね
- 人気設定ランキング
- 人気投稿者ランキング
- 新着設定
- 匿名投稿編集・削除
- Turnstile
- Rate Limit

### Phase 2

- WebHID による Nape Pro 設定読み取り
- 匿名投稿 → アカウント引き継ぎ
- AI タグ生成高度化
- 検索クエリ拡張
- 類似設定
- お気に入り
- 投稿者プロフィール強化
- ガジェット登録
- 広告
- アフィリエイト

### Phase 3

- 「この設定を使う」
- WebHID 経由で Nape Pro へ設定適用
- 設定ダウンロード数
- 設定適用数
- 使用数ランキング
- 高度なレコメンド

---

## 22. MVP で優先しないもの

初期段階では以下を作り込みすぎない。

- フォロー機能
- DM
- コメント
- 複雑な SNS 機能
- 厳密すぎる不正 Like 対策
- 高度な Reputation
- Nape Pro への設定書き込み
- ガジェット EC 機能
- 高度な管理者画面

まずは、

> 投稿される  
> ↓  
> 検索される  
> ↓  
> 閲覧される  
> ↓  
> いいねされる  
> ↓  
> また投稿される

という循環を成立させる。

---

## 23. 重要 KPI

初期段階では以下を追う。

### 投稿

- 投稿数
- 匿名投稿数
- 登録ユーザー投稿数
- 1 ユーザーあたり投稿数

### 閲覧

- Config Detail PV
- 検索回数
- 検索結果クリック率
- 関連設定クリック率

### 評価

- Like 数
- Like 率
- 投稿あたり平均 Like

### 会員化

- 匿名利用者 → アカウント化率
- 匿名投稿 → アカウント引き継ぎ率

### 将来

- 設定ダウンロード数
- 設定適用数
- 広告 CTR
- アフィリエイト CTR
- アフィリエイト CV

---

## 24. 実装で特に重要な設計原則

### 24.1 投稿のハードルを上げない

サービス成功の最重要指標は、初期段階ではユーザー登録数ではなく **投稿数**。

ユーザーに要求する入力項目は最小限にする。

### 24.2 JSON から取れる情報をユーザーに聞かない

Nape Pro 設定から解析できる情報は自動抽出する。

### 24.3 匿名ユーザーを一級市民として扱う

匿名投稿は「お試し」ではなく、正式な利用方法とする。

### 24.4 会員登録はメリットで誘導する

登録しないと使えない、ではなく、

- 投稿管理ができる
- ランキングに載る
- プロフィールを持てる
- 複数端末で使える

というメリットで登録を促す。

### 24.5 検索は意味検索を中心にする

サービスの大きな差別化ポイント。

「Chrome」という文字が含まれているから見つかるのではなく、

> ブラウザを左手だけで操作したい

というユーザーの意図から設定を発見できるようにする。

### 24.6 人気順だけにしない

人気設定だけが永久に露出する状態を防ぐ。

- Semantic relevance
- Freshness
- Popularity

を組み合わせる。

---

## 25. Codex 実装時の推奨タスク分割

### Task 1: 基盤

- Next.js プロジェクト
- Cloudflare 対応
- D1
- Schema / Migration
- 基本 Layout
- Environment Variables

### Task 2: 投稿

- Config JSON Upload
- JSON Validation
- Config Parser
- 投稿フォーム
- 匿名投稿
- Config Detail

### Task 3: Authentication

- OAuth
- User Model
- Profile
- 匿名投稿とのデータモデル共存

### Task 4: Like

- Anonymous Like
- Authenticated Like
- Like Counter
- Rate Limit

### Task 5: Semantic Search

- search_text 生成
- Workers AI Embedding
- Vectorize Index
- Search API
- Search UI
- Metadata filtering

### Task 6: Ranking

- Popular Configs
- Popular Creators
- Period Filter
- New Configs

### Task 7: Moderation

- Turnstile
- Rate Limit
- Delete / Edit
- Admin Hide
- Input Validation

### Task 8: SEO / Monetization readiness

- Metadata
- OGP
- Sitemap
- Structured Data
- Ad Slots
- Affiliate Slots

### Task 9: WebHID PoC

- Nape Pro Detection
- HID Permission
- Config Read
- JSON Conversion
- Firmware Compatibility Check

---

## 26. 初期 URL 案

```text
/
トップ

/search
セマンティック検索

/configs
設定一覧

/configs/[id]
設定詳細

/publish
設定公開

/rankings
人気設定

/creators
人気投稿者

/users/[id]
登録ユーザーのプロフィール

/me
自分の投稿管理

/login
ログイン
```

---

## 27. 初期 API / Server Action 案

```text
POST   /api/configs
GET    /api/configs/:id
PATCH  /api/configs/:id
DELETE /api/configs/:id

POST   /api/configs/:id/like
DELETE /api/configs/:id/like

GET    /api/search
GET    /api/rankings/configs
GET    /api/rankings/creators

POST   /api/configs/:id/claim
```

実際には Next.js Server Actions / Route Handlers / Cloudflare Workers の構成に合わせて選択する。

---

## 28. 未確定事項

実装しながら決定する項目。

- 正式サービス名
- Anonymous User ID の保持方式
- 編集キー形式
- OAuth ライブラリ
- Cloudflare 上での Next.js 最新推奨構成
- Workers AI で使用する Embedding Model
- Vectorize の Dimension
- Search Score の最終計算式
- AI タグ生成を Phase 1 に入れるか
- 匿名 Like をランキングへ同じ重みで加算するか
- 広告サービス
- アフィリエイトサービス
- Nape Pro 最新 Firmware での WebHID 動作

---

## 29. 最終的に目指す体験

```text
Nape Pro を買う
↓
このサイトに来る
↓
「Excel 仕事向け」など自然文で検索
↓
気になる設定を発見
↓
設定内容を見る
↓
いいね
↓
設定を自分の Nape Pro に適用

または

自分の Nape Pro を接続
↓
設定を読み込む
↓
キャッチコピーを付ける
↓
数秒で公開
↓
他のユーザーからいいねされる
```

最終目標は、

> **Nape Pro を使う人が、設定を探すとき・共有するときに最初に訪れる場所**

になること。

