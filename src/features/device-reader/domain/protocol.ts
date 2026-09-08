export const NAPE_VENDOR_ID = 13364;
export const NAPE_PRODUCT_ID = 1088;
export const NAPE_USAGE_PAGE = 0xff60;
export const HID_REPORT_ID = 0;
export const HID_PACKET_SIZE = 32;

export const NAPE_LAYER_COUNT = 9;
export const NAPE_KEY_COLUMNS = 7;
export const NAPE_ENCODER_DIRECTIONS = 2;
export const NAPE_DPI_LEVELS = 5;

const NAPE_READ_SUBCOMMANDS = new Set([
  0x20, // GET_ORI
  0x21, // GET_DPI
  0x24, // GET_DPI_VALUE
  0x38, // GET_LAYER_ORI
]);

export type ReadCommand = {
  label: string;
  bytes: readonly number[];
  timeoutMs?: number;
};

export function isAllowedReadPacket(bytes: readonly number[]): boolean {
  if (bytes.length === 0) {
    return false;
  }

  const command = bytes[0];

  if (command === 0xa1) {
    return bytes.length === 1;
  }

  if (command === 0x04) {
    return bytes.length === 4;
  }

  if (command === 0x14) {
    return bytes.length === 4;
  }

  if (command === 0xa7) {
    return bytes.length >= 2 && NAPE_READ_SUBCOMMANDS.has(bytes[1]);
  }

  return false;
}

export function firmwareCommand(): ReadCommand {
  return {
    label: "Firmware",
    bytes: [0xa1],
  };
}

export function keymapCommand(layer: number, col: number): ReadCommand {
  return {
    label: `Layer ${layer} / Key ${col}`,
    bytes: [0x04, layer, 0, col],
  };
}

export function encoderCommand(
  layer: number,
  direction: 0 | 1,
): ReadCommand {
  return {
    label: `Layer ${layer} / Encoder ${direction === 0 ? "CCW" : "CW"}`,
    bytes: [0x14, layer, 0, direction],
  };
}

export function dpiCurrentLevelCommand(): ReadCommand {
  return {
    label: "DPI current level",
    bytes: [0xa7, 0x21],
  };
}

export function dpiLevelValueCommand(level: number): ReadCommand {
  return {
    label: `DPI level ${level}`,
    bytes: [0xa7, 0x24, level],
  };
}

export function globalOrientationCommand(): ReadCommand {
  return {
    label: "Orientation",
    bytes: [0xa7, 0x20],
  };
}

export function layerOrientationCommand(layer: number): ReadCommand {
  return {
    label: `Layer ${layer} orientation`,
    bytes: [0xa7, 0x38, layer],
  };
}

export function readU16Le(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

export function readU16Be(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

export function decodeFirmware(bytes: Uint8Array): string {
  const raw = bytes
    .slice(1)
    .filter((value) => value !== 0);

  return String.fromCharCode(...raw).trim();
}

export function classifyFirmware(firmware: string) {
  const normalized = firmware.toLowerCase();

  const verified =
    normalized.includes("v1.2.3") ||
    normalized.includes("v1.2.5") ||
    normalized.startsWith("010203") ||
    normalized.startsWith("010205");

  return verified ? ("verified" as const) : ("unverified" as const);
}
