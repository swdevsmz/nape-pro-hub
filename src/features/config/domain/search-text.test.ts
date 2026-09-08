import { describe, expect, it } from "vitest";

import type { NapeProHubConfig } from "./types";
import { buildConfigSearchText } from "./search-text";

const config: NapeProHubConfig = {
  hubSchemaVersion: "1",
  rawSnapshotSchemaVersion: "1",
  device: {
    model: "Keychron Nape Pro",
    firmwareVersion: "v1.2.5-ZK",
  },
  layers: [
    {
      deviceLayerIndex: 0,
      displayName: "Layer 0",
      keys: [
        { rawCode: 40, label: "Enter", known: true },
        { rawCode: 212, label: "戻る", known: true },
      ],
      encoder: {
        ccw: { rawCode: 217, label: "スクロール↑", known: true },
        cw: { rawCode: 218, label: "スクロール↓", known: true },
      },
    },
  ],
  dpi: {
    currentLevel: 0,
    levels: [{ level: 0, dpi: 1200 }],
  },
  unknown: [],
  warnings: [],
};

describe("buildConfigSearchText", () => {
  it("includes metadata and decoded assignments in normalized form", () => {
    const text = buildConfigSearchText(
      {
        title: "Chromeを親指だけで操作",
        description: "ブラウザ操作",
        usageTags: ["コーディング"],
        placement: "縦置き",
      },
      config,
    );

    expect(text).toContain("chromeを親指だけで操作");
    expect(text).toContain("enter");
    expect(text).toContain("戻る");
    expect(text).toContain("縦置き");
    expect(text).toContain("layer 0");
  });
});
