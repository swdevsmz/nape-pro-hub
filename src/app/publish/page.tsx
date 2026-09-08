import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function PublishPage() {
  return (
    <main className="page-shell">
      <section className="app-frame publish-frame">
        <SiteHeader active="publish" />

        <div className="publish-content">
          <div className="publish-heading">
            <h1>設定を公開</h1>
            <p>あなたのNape Proの設定を読み取って、みんなにシェアしましょう。</p>
          </div>

          <ol className="steps" aria-label="公開ステップ">
            <li className="active"><strong>1</strong><span>読み取り</span></li>
            <li><strong>2</strong><span>情報を入力</span></li>
            <li><strong>3</strong><span>プレビュー</span></li>
            <li><strong>4</strong><span>公開</span></li>
          </ol>

          <section className="reader-card">
            <h2>Nape Proから設定を読み取る</h2>
            <p>Nape ProをPCに接続して、現在の設定を読み取ります。</p>
            <Link className="primary-button primary-link-button" href="/device-reader-poc">
              Nape Proから設定を読み取る
            </Link>
            <small>読み取り専用です。MVPでは設定を書き込みません。</small>
          </section>

          <section className="publish-form-card">
            <h2>設定の情報を入力</h2>

            <label>
              <span>タイトル <b>*</b></span>
              <input placeholder="設定のタイトルを入力してください" />
            </label>

            <label>
              <span>説明</span>
              <textarea placeholder="この設定の使い方や、どんな場面で便利かを教えてください。" rows={4} />
            </label>

            <label>
              <span>対象アプリ・用途</span>
              <input placeholder="例）ブラウザ、コーディング、動画編集 など" />
            </label>

            <button className="primary-button" type="button">
              プレビューに進む →
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
