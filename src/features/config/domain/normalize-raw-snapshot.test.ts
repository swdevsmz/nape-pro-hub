import { describe, expect, it } from "vitest";

import { RAW_NAPE_SNAPSHOT_SCHEMA_VERSION } from "@/features/device-reader/domain/types";
import type { RawNapeSnapshot } from "@/features/device-reader/domain/types";

import { normalizeRawNapeSnapshot } from "./normalize-raw-snapshot";
import { deserializeHubConfig, serializeHubConfig } from "./serialization";

function snapshotFixture(): RawNapeSnapshot {
  return {
    rawSchemaVersion: RAW_NAPE_SNAPSHOT_SCHEMA_VERSION,
    device: {
      productName: "Keychron Nape Pro",
      vendorId: 13364,
      productId: 1088,
    },
    firmware: "v1.2.5-ZK",
    firmwareCompatibility: "verified",
    layerCount: 1,
    keymap: [[40, 65535]],
    encoders: [{ ccw: 217, cw: 218 }],
    dpi: {
      currentLevel: 1,
      levels: [
        { level: 0, dpi: 800 },
        { level: 1, dpi: 1200 },
      ],
    },
    orientation: {
      global: 2,
      perLayer: [3],
    },
    warnings: [],
  };
}

describe("normalizeRawNapeSnapshot", () => {
  it("converts a raw snapshot into the versioned Hub model", () => {
    const config = normalizeRawNapeSnapshot(snapshotFixture());

    expect(config.hubSchemaVersion).toBe("1");
    expect(config.rawSnapshotSchemaVersion).toBe("1");
    expect(config.device).toEqual({
      model: "Keychron Nape Pro",
      firmwareVersion: "v1.2.5-ZK",
    });
    expect(config.layers[0].deviceLayerIndex).toBe(0);
    expect(config.layers[0].displayName).toBe("Layer 0");
    expect(config.layers[0].keys[0]).toEqual({
      rawCode: 40,
      label: "Enter",
      known: true,
    });
    expect(config.layers[0].orientation).toEqual({
      raw: 3,
      degrees: 135,
    });
    expect(config.orientation).toEqual({
      globalRaw: 2,
      globalDegrees: 90,
    });
  });

  it("preserves unknown keycodes instead of dropping them", () => {
    const config = normalizeRawNapeSnapshot(snapshotFixture());

    expect(config.layers[0].keys[1]).toEqual({
      rawCode: 65535,
      label: "Unknown 0xFFFF",
      known: false,
    });
    expect(config.unknown).toEqual([
      {
        path: "layers[0].keys[1]",
        kind: "keycode",
        raw: 65535,
      },
    ]);
  });

  it("round-trips through persisted JSON without losing config data", () => {
    const config = normalizeRawNapeSnapshot(snapshotFixture());
    const restored = deserializeHubConfig(serializeHubConfig(config));

    expect(restored).toEqual(config);
  });
});
