import { decodeKeycode } from "@/features/device-reader/domain/keycode-labels";
import type { RawNapeSnapshot } from "@/features/device-reader/domain/types";

import {
  HUB_CONFIG_SCHEMA_VERSION,
  type HubKeyAssignment,
  type NapeProHubConfig,
  type UnknownDeviceValue,
} from "./types";

function assignment(
  rawCode: number,
  path: string,
  unknown: UnknownDeviceValue[],
): HubKeyAssignment {
  const decoded = decodeKeycode(rawCode);

  if (!decoded.known) {
    unknown.push({
      path,
      kind: "keycode",
      raw: rawCode,
    });
  }

  return {
    rawCode,
    label: decoded.label,
    known: decoded.known,
  };
}

function orientationDegrees(raw: number): number {
  return raw * 45;
}

export function normalizeRawNapeSnapshot(
  snapshot: RawNapeSnapshot,
): NapeProHubConfig {
  const unknown: UnknownDeviceValue[] = [];

  const layers = snapshot.keymap.map((keycodes, deviceLayerIndex) => {
    const encoder = snapshot.encoders[deviceLayerIndex];
    const layerOrientation = snapshot.orientation?.perLayer[deviceLayerIndex];

    return {
      deviceLayerIndex,
      displayName: `Layer ${deviceLayerIndex}`,
      keys: keycodes.map((rawCode, keyIndex) =>
        assignment(
          rawCode,
          `layers[${deviceLayerIndex}].keys[${keyIndex}]`,
          unknown,
        ),
      ),
      encoder: encoder
        ? {
            ccw: assignment(
              encoder.ccw,
              `layers[${deviceLayerIndex}].encoder.ccw`,
              unknown,
            ),
            cw: assignment(
              encoder.cw,
              `layers[${deviceLayerIndex}].encoder.cw`,
              unknown,
            ),
          }
        : undefined,
      orientation:
        layerOrientation === undefined
          ? undefined
          : {
              raw: layerOrientation,
              degrees: orientationDegrees(layerOrientation),
            },
    };
  });

  return {
    hubSchemaVersion: HUB_CONFIG_SCHEMA_VERSION,
    rawSnapshotSchemaVersion: snapshot.rawSchemaVersion,
    device: {
      model: "Keychron Nape Pro",
      firmwareVersion: snapshot.firmware || undefined,
    },
    layers,
    dpi: {
      currentLevel: snapshot.dpi.currentLevel,
      levels: snapshot.dpi.levels.map((level) => ({ ...level })),
    },
    orientation: snapshot.orientation
      ? {
          globalRaw: snapshot.orientation.global,
          globalDegrees: orientationDegrees(snapshot.orientation.global),
        }
      : undefined,
    unknown,
    warnings: [...snapshot.warnings],
  };
}
