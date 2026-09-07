# napepro-hub-mvp 要件定義書

## 概要

Nape Proユーザーが、自分の実機設定をブラウザから読み取り、その内容を見やすく公開・共有できる日本語中心の非公式ファンサイトMVPを構築する。

MVPの中心体験は次の通り。

```text
Nape ProをUSB接続
  ↓
「設定を読み取る」
  ↓
WebHIDでRead Only取得
  ↓
Launcher風の独自プレビュー
  ↓
タイトルを入力
  ↓
公開
  ↓
一覧・詳細・検索で他ユーザーが閲覧
```

## 関連文書

- [user-stories.md](user-stories.md)
- [acceptance-criteria.md](acceptance-criteria.md)
- [plan.md](plan.md)

## 用語

| 用語 | 定義 |
|---|---|
| Device Snapshot | WebHIDでNape Proから読み取った生の設定スナップショット |
| Hub Config | Device SnapshotをNapePro Hub内部形式へ正規化した設定 |
| Config Post | Hub Configにタイトル・説明等を付けて公開した投稿 |
| Reader | Nape ProへGET系コマンドだけを送るWebHID読取モジュール |
| Manage Token | 匿名投稿の編集・削除に使う秘密トークン |

## 機能要件

### 閲覧

- **FR-001**: 未ログイン利用者は公開Config Postの一覧と詳細を閲覧できなければならない。
- **FR-002**: 一覧は設定をカード形式で表示し、タイトル、投稿者名、主要タグ、代表Layerの割当概要を確認できなければならない。
- **FR-003**: 詳細ページはLayerを切り替えながら、Nape Pro本体上の各キー割当を視覚的に確認できなければならない。
- **FR-004**: 詳細ページは取得できた範囲でDPI、Orientation、Encoder、Gesture、Combo、Tap/Hold等を人間向けに表示しなければならない。

### 実機読取

- **FR-101**: 対応ブラウザでユーザー操作を起点にWebHIDデバイス選択を行えなければならない。
- **FR-102**: ReaderはNape Proを識別し、Firmware情報を取得できなければならない。
- **FR-103**: Readerは実機で確認済みのGET系コマンドだけを使い、設定スナップショットを生成しなければならない。
- **FR-104**: Readerは未知のキーコードを捨てず、raw codeを保持しなければならない。
- **FR-105**: 未対応Firmwareまたはプロトコル差異を検出した場合、推測して読み続けず、安全なエラーとして利用者へ表示しなければならない。

### 公開

- **FR-201**: 読み取り完了後、ユーザーは設定内容を公開前にプレビューできなければならない。
- **FR-202**: 投稿時の必須入力はタイトルと有効なHub Configとする。
- **FR-203**: 投稿者名、説明、用途タグ、置き方は任意入力とする。
- **FR-204**: 匿名投稿時、システムはManage Tokenを発行し、サーバーにはhashだけを保存しなければならない。
- **FR-205**: 正しいManage Tokenを持つ利用者は自分の投稿を編集・削除できなければならない。

### 検索

- **FR-301**: 一覧画面でキーワード検索を提供しなければならない。
- **FR-302**: 検索対象はタイトル、説明、投稿者名、用途タグ、デコード済みキー割当名、Layer概要とする。
- **FR-303**: MVPの検索はD1上の単純文字列検索とし、Embedding・Vector Searchを必要としない。

### 公開状態と防御

- **FR-401**: `hidden` または `deleted` の投稿を公開一覧・検索・詳細へ表示してはならない。
- **FR-402**: 投稿APIは入力サイズ、文字数、JSON構造、XSS相当入力を検証しなければならない。
- **FR-403**: 匿名投稿にはTurnstileとRate Limitを適用しなければならない。

## 禁止要件

- **FR-901**: MVPはNape Proへ設定を書き込んではならない。
- **FR-902**: MVPのReaderはSET、DELETE、SAVE相当のHIDコマンドを送信してはならない。
- **FR-903**: MVPは公式LauncherのUI画像・CSS・アイコンをコピーしてはならない。
- **FR-904**: MVPはOAuth、Like、Ranking、Workers AI、Vectorize、Queues、広告・アフィリエイトを必須依存にしてはならない。
- **FR-905**: 実機で確認していないNape Proプロトコルを推測実装してはならない。

## 非機能要件

### 安全性

- **NFR-101**: HIDコマンドはread allowlist方式とし、未知opcodeを拒否する。
- **NFR-102**: 読み取り凩理失敗時にデバイス側設定を変更しない。
- **NFR-103**: Manage Token、生IP、Turnstile secret、Cookie内容をログへ出力しない。

### 互換性

- **NFR-201**: WebHID非対応ブラウザでは、対応ブラウザを案内して安全に終了する。
- **NFR-202**: 現行Nape Pro実機による手動Smoke Testをリリース条件に含める。
- **NFR-203**: Firmware差異を後から追加できるようReaderとHub Configを分離する。

### パフォーマンス

- **NFR-301**: 公開一覧・詳細・検索は通常条件でp95 2秒以内を目標とする。
- **NFR-302**: 読み取りUIは進捗を表示し、長時間無反応に見えないようにする。

### ユーザビリティ

- **NFR-401**: UIは日本語中心とする。
- **NFR-402**: 投稿はユーザー登録なしで完了できる。
- **NFR-403**: 設定値をJSONだけで見せず、キー配置図と人間可読名を主表示にする。

## MVP対象外

- JSONファイルアップロードによる投稿
- Nape ProへのImport / Apply
- Backup / Restore
- Fork / Variant
- OAuth / User Profile
- Like / Ranking / View count
- Semantic Search / AI tagging
- お気に入り
- 広告 / Affiliate

## 技術制約

- Next.js + TypeScriptをCloudflare Workersへvinextで配備する。
- 永続化はCloudflare D1 + Drizzleを利用する。
- WebHID処理はClient側に閉じ込め、Server側からHIDへアクセスしない。
- WebHIDの実機仕様確定はTask 002をGo/No-Go gateとする。
