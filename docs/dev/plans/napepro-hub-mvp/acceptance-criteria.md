# napepro-hub-mvp 受入基準

## AC-001: 公開設定一覧

### Given
- 公開Config Postが存在する。

### When
- 未ログイン利用者が `/` を開く。

### Then
- 設定カードが表示される。
- 各カードにタイトル、投稿者名（存在する場合）、主要タグ、代表Layerの割当概要が表示される。
- `hidden` / `deleted` は表示されない。

- [ ] 0件時は空状態を表示する
- [ ] ログイン要求をしない

## AC-002: 設定詳細の視覚表示

### Given
- Layerを含むHub Configが公開されている。

### When
- `/configs/[id]` を開く。

### Then
- Nape Pro本体を模した独自デバイス図にキー割当名が表示される。
- Layer切替で表示内容が変わる。
- 取得できたDPI、Encoder、Orientation、Gesture、Combo、Tap/Holdが人間可読表示される。
- 未知キーコードは `Unknown (0x....)` 等でraw値を失わず表示できる。

## AC-003: WebHID接続と読取

### Given
- 対応ブラウザでNape ProがUSB接続されている。

### When
- `/publish` で「Nape Proから設定を読み取る」を押し、デバイス利用を許可する。

### Then
- Nape Proを識別し、Firmwareを取得する。
- 実機検証済み項目を読み取り、Hub Configプレビューを生成する。
- 読み取り進捗がUIに表示される。

## AC-004: Read Only保証

### Given
- Readerの単体テストと実機Smoke Testを実行する。

### When
- 設定読取を行う。

### Then
- allowlistにないHID opcodeは送信できない。
- SET / DELETE / SAVE相当コマンドはコードパス上で拒否される。
- 読み取り前後で実機設定が変化しない。

- [ ] 低レベルtransportへ禁止opcodeを渡すテストが失敗する
- [ ] Reader public APIにwrite/import/applyメソッドが存在しない

## AC-005: 公開プレビューと投稿

### Given
- Nape Pro読取が成功している。

### When
- 1〜80文字のタイトルを入力して公開する。

### Then
- 公開前プレビューと同じ設定内容がD1に保存される。
- 投稿後に個別URLへ遷移する。
- 投稿者名、説明、用途タグ、置き方は空でも投稿できる。

- [ ] タイトル空は拒否する
- [ ] サイズ上限超過は拒否する

## AC-006: 匿名投稿管理

### Given
- 匿名投稿が作成されManage Tokenが発行されている。

### When
- 正しいToken / 誤ったTokenで編集・削除を試す。

### Then
- 正しいTokenだけが操作できる。
- Tokenは平文保存されない。
- 削除後は一覧・検索・詳細から除外される。

## AC-007: 簡易検索

### Given
- タイトル、説明、タグ、キー割当に異なる文字列を持つ複数投稿がある。

### When
- 一覧の検索欄へキーワードを入力する。

### Then
- title / description / author / tags / decoded key assignments / Layer summaryのいずれかに一致する公開投稿だけが返る。
- 空検索では通常一覧を返す。
- AI / Vectorizeなしで動作する。

## AC-008: 非対応環境・Firmware

### Given
- WebHID非対応ブラウザ、Nape Pro以外のHID、未検証Firmwareの各ケースがある。

### When
- 読み取りを開始する。

### Then
- デバイス設定を書き換えず処理を停止する。
- 利用者へ原因と対応ブラウザ/再試行方法を表示する。
- 未知プロトコルを推測して継続しない。

## AC-009: 投稿防御

- [ ] Turnstile失敗を拒否する
- [ ] Rate Limit超過を拒否する
- [ ] XSS相当文字列を無害化する
- [ ] Manage Token / raw IP / secretをログへ出さない

## AC-010: リリース品質

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] Workers integration tests
- [ ] `pnpm build`
- [ ] Playwright E2E
- [ ] vinext compatibility check
- [ ] Cloudflare preview
- [ ] 現行Nape Pro実機によるRead-only smoke test

すべて成功してMVPリリース可能とする。
