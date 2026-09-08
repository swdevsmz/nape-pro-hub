import {
  HUB_CONFIG_SCHEMA_VERSION,
  type NapeProHubConfig,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function serializeHubConfig(config: NapeProHubConfig): string {
  return JSON.stringify(config);
}

export function deserializeHubConfig(serialized: string): NapeProHubConfig {
  const parsed: unknown = JSON.parse(serialized);

  if (
    !isRecord(parsed) ||
    parsed.hubSchemaVersion !== HUB_CONFIG_SCHEMA_VERSION ||
    !Array.isArray(parsed.layers) ||
    !isRecord(parsed.device) ||
    parsed.device.model !== "Keychron Nape Pro"
  ) {
    throw new Error("Unsupported or invalid NapePro Hub config snapshot.");
  }

  return parsed as NapeProHubConfig;
}
