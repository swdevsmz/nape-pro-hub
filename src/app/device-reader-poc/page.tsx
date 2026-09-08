import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { DeviceReaderPoc } from "@/features/device-reader/components/device-reader-poc";

export default function DeviceReaderPocPage() {
  return (
    <main className="page-shell">
      <section className="app-frame">
        <SiteHeader active="publish" />

        <div className="detail-content">
          <Link className="back-link" href="/publish">
            ← 設定公開に戻る
          </Link>

          <div className="publish-heading">
            <h1>Nape Pro 読み取りPoC</h1>
            <p>
              現行Nape Proから、設定を変更せずに読み取れるかを確認する開発用画面です。
            </p>
          </div>

          <DeviceReaderPoc />
        </div>
      </section>
    </main>
  );
}
