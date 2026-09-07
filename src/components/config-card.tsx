import Link from "next/link";

import { NapeDevice } from "@/components/nape-device";
import type { DemoConfig } from "@/lib/demo-configs";

export function ConfigCard({ config }: { config: DemoConfig }) {
  return (
    <Link className="config-card" href={`/configs/${config.id}`}>
      <div className="config-card-copy">
        <h2>{config.title}</h2>
        <p>{config.subtitle}</p>
      </div>

      <NapeDevice mappings={config.mappings} />

      <div className="config-meta" aria-label="設定概要">
        <span>{config.category}</span>
        <span>{config.layer}</span>
        <span>DPI {config.dpi}</span>
      </div>
    </Link>
  );
}
