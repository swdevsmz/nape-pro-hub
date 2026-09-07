import { ConfigCard } from "@/components/config-card";
import { SiteHeader } from "@/components/site-header";
import { demoConfigs } from "@/lib/demo-configs";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="app-frame">
        <SiteHeader active="list" />

        <div className="page-heading-row">
          <div>
            <h1>設定一覧</h1>
            <p>みんなの工夫から、あなたの作業をもっと快適に。</p>
          </div>

          <label className="search-box">
            <span className="sr-only">設定を検索</span>
            <input placeholder="設定を検索..." type="search" />
          </label>
        </div>

        <div className="config-grid">
          {demoConfigs.map((config) => (
            <ConfigCard config={config} key={config.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
