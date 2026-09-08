export const HUB_CONFIG_SCHEMA_VERSION = "1" as const;

export type HubKeyAssignment = {
  rawCode: number;
  label: string;
  known: boolean;
};

export type NapeLayer = {
  deviceLayerIndex: number;
  displayName: string;
  keys: HubKeyAssignment[];
  encoder?: {
    ccw: HubKeyAssignment;
    cw: HubKeyAssignment;
  };
  orientation?: {
    raw: number;
    degrees: number;
  };
};

export type DpiConfig = {
  currentLevel: number;
  levels: Array<{
    level: number;
    dpi: number;
  }>;
};

export type UnknownDeviceValue = {
  path: string;
  kind: "keycode";
  raw: number;
};

export type NapeProHubConfig = {
  hubSchemaVersion: typeof HUB_CONFIG_SCHEMA_VERSION;
  rawSnapshotSchemaVersion: string;
  device: {
    model: "Keychron Nape Pro";
    firmwareVersion?: string;
  };
  layers: NapeLayer[];
  dpi?: DpiConfig;
  orientation?: {
    globalRaw: number;
    globalDegrees: number;
  };
  unknown: UnknownDeviceValue[];
  warnings: string[];
};

export type PublishConfigMetadata = {
  title: string;
  description?: string;
  authorDisplayName?: string;
  usageTags?: string[];
  placement?: string;
};
