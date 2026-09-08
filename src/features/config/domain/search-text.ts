import type {
  NapeProHubConfig,
  PublishConfigMetadata,
} from "./types";

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
}

export function buildConfigSearchText(
  metadata: PublishConfigMetadata,
  config: NapeProHubConfig,
): string {
  const parts: string[] = [
    metadata.title,
    metadata.description ?? "",
    metadata.authorDisplayName ?? "",
    ...(metadata.usageTags ?? []),
    metadata.placement ?? "",
    config.device.firmwareVersion ?? "",
  ];

  for (const layer of config.layers) {
    parts.push(layer.displayName);
    parts.push(...layer.keys.map((key) => key.label));

    if (layer.encoder) {
      parts.push(layer.encoder.ccw.label, layer.encoder.cw.label);
    }
  }

  return normalizeText(parts.filter(Boolean).join(" ").replace(/\s+/g, " "));
}
