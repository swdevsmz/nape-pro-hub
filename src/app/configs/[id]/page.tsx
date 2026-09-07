import Link from "next/link";
import { notFound } from "next/navigation";

import { NapeDevice } from "@/components/nape-device";
import { SiteHeader } from "@/components/site-header";
import { findDemoConfig } from "@/lib/demo-configs";

type ConfigDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConfigDetailPage({
  params,
}: ConfigDetailPageProps) {
  const { id } = await params;
  const config = findDemoConfig(id);

  if (!config) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="app-frame detail-frame">
        <SiteHeader active="list" />

        <div className="detail-content">
          <Link className="back-link" href="/">
            ← 一覧に戻る
          </Link>

          <div className="detail-title-row">
            <div>
              <h1>{config.title}</h1>
              <p>{config.subtitle}。よく使う操作を親指まわりにまとめた設定です。</p>
              <div className="config-meta detail-meta">
                <span>{config.category}</span>
                <span>{config.layer}</span>
                <span>DPI {config.dpi}</span>
              </div>
            </div>
          </div>

          <div className="detail-device">
            <NapeDevice mappings={config.mappings} size="detail" />
          </div>

          <div className="layer-tabs" role="tablist" aria-label="レイヤー">
            <button className="active" type="button">Layer 0</button>
            <button type="button">Layer 1</button>
            <button type="button">Layer 2</button>
            <button type="button">Layer 3</button>
          </div>

          <section className="info-card">
            <h2>設定情報</h2>
            <dl className="settings-list">
              <div><dt>カテゴリ</dt><dd>{config.category}</dd></div>
              <div><dt>DPI</dt><dd>{config.dpi}</dd></div>
              <div><dt>レイヤー</dt><dd>{config.layer}</dd></div>
              <div><dt>公開日</dt><dd>2026/09/08</dd></div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}
