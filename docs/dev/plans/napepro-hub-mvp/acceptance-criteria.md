# napepro-hub-mvp 受入基準

## 関連文書

- [requirements.md](requirements.md)
- [user-stories.md](user-stories.md)

## AC-001: FR-001 登録なしの閲覧 🔵

**関連**: FR-001, NFR-201, US-001

### Given
- 有効な公開Configが1件以上存在する。

### When
- 未ログイン利用者がトップ、一覧、詳細を開く。

### Then
- ログインを要求されず、キャッチコピー・作者・Like数・抽出概要が表示される。

- [ ] 正常系: Cookieなしで公開詳細が200を返す 🔵
- [ ] 異常系: hidden/deleted Configは404となる 🔵
- [ ] 境界値: Configが0件でも空状態を表示する 🟡

## AC-002: FR-005 自然文検索 🔵

**関連**: FR-005, US-002

### Given
- 「Chromeを左手で操作したい」に関連するConfigが索引済みである。

### When
- 利用者が自然文を入力して検索する。

### Then
- Semantic similarityを主スコアとして関連Configが返り、フィルターとcursor paginationが機能する。

- [ ] 正常系: 日本語クエリで関連結果が返る 🔵
- [ ] 異常系: 空/長すぎるクエリは検証エラーになる 🟡
- [ ] 境界値: 結果0件・50件超の候補を処理する 🟡

## AC-003: FR-002 投稿フォーム 🔵

**関連**: FR-002, US-003

### Given
- 未ログイン利用者が公開画面を開いている。

### When
- 1MiB以内のJSONと1〜80文字のキャッチコピーを送信する。

### Then
- 投稿が受理され、投稿ID・slug・索引状態・編集コードが返る。

- [ ] 正常系: 任意項目なしでも202を返す 🔵
- [ ] 異常系: JSONなし、キャッチコピー空、サイズ超過を拒否する 🔵
- [ ] 境界値: 80文字は受理し81文字は拒否する 🟡

## AC-004: FR-003/FR-101 JSON解析 🔵

**関連**: FR-003, FR-101, US-003

### Given
- 正常版、旧版、未知版、破損JSONのfixtureがある。

### When
- 投稿処理がJSONを検証・解析する。

### Then
- 対応版は属性・決定的タグ・Search textを生成し、未知版/破損版は保存しない。

- [ ] 正常系: レイヤー数、DPI、Gesture等が抽出される 🔵
- [ ] 異常系: prototype pollution相当の入力を無害化する 🔵
- [ ] 境界値: 最大深度・未知フィールド・空配列を処理する 🟡

## AC-005: FR-102 索引と公開状態 🟡

**関連**: FR-004, FR-102, FR-202, US-003

### Given
- 投稿がD1へ保存され、Index jobがQueueへ送信される。

### When
- Queue consumerがEmbeddingとVectorize upsertを実行する。

### Then
- 初回は索引成功後に公開され、失敗時は再試行可能なfailed状態となる。古いrevisionは新しい索引を上書きしない。

- [ ] 正常系: upsert成功後に検索結果へ現れる 🟡
- [ ] 異常系: AI/Vectorize失敗が自動再試行される 🟡
- [ ] 境界値: 同一job再送が重複vectorを作らない 🟡

## AC-006: FR-005 フィルター 🔵

**関連**: FR-005, US-002

### Given
- application、layer_count、gesture等のmetadataがある。

### When
- 利用者が検索語と複数フィルターを指定する。

### Then
- 条件に一致する公開ConfigだけがSemantic score順で返る。

- [ ] 正常系: applicationとlayer_countのAND条件が機能する 🔵
- [ ] 異常系: 不正なenum/数値を拒否する 🟡

## AC-007: FR-006 Like重複防止 🔵

**関連**: FR-006, US-004

### Given
- 匿名またはGoogleログイン利用者が詳細を開いている。

### When
- 同じ利用者が同じConfigへLikeを複数回送る。

### Then
- Likeは1票だけで、DELETEで取り消せる。匿名票もランキングに1票として加算される。

- [ ] 正常系: 匿名/登録Likeの作成と取消が反映される 🔵
- [ ] 異常系: 同時送信でも重複行がない 🔵
- [ ] 境界値: hidden ConfigへのLikeを拒否する 🟡

## AC-008: FR-007 ランキング 🔵

**関連**: FR-007, US-005

### Given
- 複数期間のLike履歴と登録投稿者が存在する。

### When
- 利用者が期間タブを切り替える。

### Then
- 今日/今週/今月/歴代の人気設定と、登録ユーザーのみの人気投稿者が表示される。

- [ ] 正常系: 期間境界を含めて集計される 🔵
- [ ] 異常系: deleted/hiddenを除外する 🔵

## AC-009: FR-008 Google OAuth 🔵

**関連**: FR-008, US-006

### Given
- Google OAuth test stubが利用可能である。

### When
- 利用者がログインし、投稿管理を開く。

### Then
- セッション、プロフィール、投稿一覧が表示され、第三者の投稿は編集できない。

- [ ] 正常系: 初回ログインでuserが作成される 🔵
- [ ] 異常系: callback失敗・期限切れセッションを拒否する 🟡

## AC-010: FR-103/104 匿名所有権 🔵

**関連**: FR-103, FR-104, US-003

### Given
- 匿名投稿とCookie、投稿別編集コードが発行済みである。

### When
- 所有者、第三者、Cookieを失った所有者が編集/削除を試みる。

### Then
- Cookieまたは正しいコードだけが許可され、誤コード・第三者は403となる。

- [ ] 正常系: Cookieありで編集・削除できる 🔵
- [ ] 正常系: 正しい編集コードで復旧できる 🟡
- [ ] 異常系: コード推測・他Configへの流用を拒否する 🟡

## AC-011: FR-105/201 モデレーション 🟡

**関連**: FR-105, FR-201, US-007

### Given
- 管理者メールがallowlistにあり、対象Configが公開中である。

### When
- 管理者が非公開化・再公開・索引再試行を行う。

### Then
- 公開面から即時除外/復帰し、監査ログにactor・理由・時刻が残る。

- [ ] 正常系: allowlist管理者のみ操作できる 🟡
- [ ] 異常系: 一般ユーザーは管理画面へ到達できない 🔵

## AC-012: FR-106/NFR-101 入力防御 🔵

**関連**: FR-106, FR-401, NFR-101, US-004, US-007

### Given
- Turnstile失敗、Rate Limit超過、XSS文字列の各入力がある。

### When
- 投稿、Like、編集を送信する。

### Then
- 検証失敗は拒否され、HTML/secret/IPは保存・ログ出力されない。

- [ ] 正常系: Turnstile成功と制限内要求が通る 🔵
- [ ] 異常系: token再利用、連打、script入力を拒否する 🔵

## AC-013: FR-301 基本SEO 🟡

**関連**: FR-301, US-008

### Given
- 公開Configの詳細ページがある。

### When
- クローラーまたはSNSクライアントがページを取得する。

### Then
- title/description、OGP、canonical、sitemap、JSON-LDが公開内容と一致する。

- [ ] 正常系: 公開ページのmetadataが生成される 🟡
- [ ] 異常系: hidden/deleted URLがsitemapに出ない 🔵

## AC-014: FR-402 Phase境界 🔵

**関連**: FR-402

- [ ] WebHID、実機書込、claim、お気に入り、類似設定、raw JSON download、広告APIがMVPに存在しない。

## AC-015: NFR-001/002/202 品質ゲート 🟡

**関連**: NFR-001, NFR-002, NFR-202

- [ ] 公開ページ/検索p95 2秒以内、投稿受付p95 1秒以内、検索反映95%が30秒以内。
- [ ] lint、typecheck、unit、Workers integration、build、Playwright、vinext compatibilityがCIで成功する。
- [ ] 主要導線がキーボード操作可能で、重大なaxe違反がない。

## テストサマリー

| カテゴリ | 正常系 | 異常系 | 境界値 | 合計 |
|---|---:|---:|---:|---:|
| 機能要件 | 18 | 14 | 8 | 40 |
| 非機能要件 | 4 | 3 | 2 | 9 |
| 合計 | 22 | 17 | 10 | 49 |

## 信頼性レベル分布

- 🔵 青信号: 12件
- 🟡 黄信号: 3件
- 🔴 赤信号: 0件
