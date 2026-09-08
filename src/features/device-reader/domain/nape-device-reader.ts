import {
  classifyFirmware,
  decodeFirmware,
  dpiCurrentLevelCommand,
  dpiLevelValueCommand,
  encoderCommand,
  firmwareCommand,
  globalOrientationCommand,
  keymapCommand,
  layerOrientationCommand,
  NAPE_DPI_LEVELS,
  NAPE_ENCODER_DIRECTIONS,
  NAPE_KEY_COLUMNS,
  NAPE_LAYER_COUNT,
  readU16Be,
  readU16Le,
  type ReadCommand,
} from "./protocol";
import {
  RAW_NAPE_SNAPSHOT_SCHEMA_VERSION,
  type NapeDeviceInfo,
  type RawNapeSnapshot,
  type ReadConfigOptions,
  type ReadProgress,
} from "./types";

export interface HidTransport {
  readonly deviceInfo: NapeDeviceInfo;
  sendReadCommand(command: ReadCommand): Promise<Uint8Array>;
}

export class UnverifiedFirmwareError extends Error {
  constructor(public readonly firmware: string) {
    super(
      `Firmware "${firmware || "unknown"}" has not been verified for NapePro Hub.`,
    );
    this.name = "UnverifiedFirmwareError";
  }
}

export class NapeDeviceReader {
  constructor(private readonly transport: HidTransport) {}

  detect(): NapeDeviceInfo {
    return this.transport.deviceInfo;
  }

  async readConfig(options: ReadConfigOptions = {}): Promise<RawNapeSnapshot> {
    const total =
      1 +
      NAPE_LAYER_COUNT * NAPE_KEY_COLUMNS +
      NAPE_LAYER_COUNT * NAPE_ENCODER_DIRECTIONS +
      1 +
      NAPE_DPI_LEVELS +
      1 +
      NAPE_LAYER_COUNT;

    let completed = 0;
    const progress = (label: string) => {
      completed += 1;
      options.onProgress?.({ completed, total, label } satisfies ReadProgress);
    };

    const firmwareResponse = await this.transport.sendReadCommand(
      firmwareCommand(),
    );
    const firmware = decodeFirmware(firmwareResponse);
    const firmwareCompatibility = classifyFirmware(firmware);
    progress("Firmware");

    if (
      firmwareCompatibility === "unverified" &&
      !options.allowUnverifiedFirmware
    ) {
      throw new UnverifiedFirmwareError(firmware);
    }

    const keymap: number[][] = [];
    for (let layer = 0; layer < NAPE_LAYER_COUNT; layer += 1) {
      const keys: number[] = [];
      for (let col = 0; col < NAPE_KEY_COLUMNS; col += 1) {
        const response = await this.transport.sendReadCommand(
          keymapCommand(layer, col),
        );
        keys.push(readU16Be(response, 4));
        progress(`Layer ${layer} / Key ${col}`);
      }
      keymap.push(keys);
    }

    const encoders = [];
    for (let layer = 0; layer < NAPE_LAYER_COUNT; layer += 1) {
      const codes: number[] = [];
      for (
        let direction = 0;
        direction < NAPE_ENCODER_DIRECTIONS;
        direction += 1
      ) {
        const response = await this.transport.sendReadCommand(
          encoderCommand(layer, direction as 0 | 1),
        );
        codes.push(readU16Be(response, 4));
        progress(
          `Layer ${layer} / Encoder ${direction === 0 ? "CCW" : "CW"}`,
        );
      }
      encoders.push({ ccw: codes[0], cw: codes[1] });
    }

    const currentDpiResponse = await this.transport.sendReadCommand(
      dpiCurrentLevelCommand(),
    );
    const currentLevel = currentDpiResponse[2];
    progress("DPI current level");

    const levels = [];
    for (let level = 0; level < NAPE_DPI_LEVELS; level += 1) {
      const response = await this.transport.sendReadCommand(
        dpiLevelValueCommand(level),
      );
      levels.push({ level, dpi: readU16Le(response, 2) });
      progress(`DPI level ${level}`);
    }

    const warnings: string[] = [];
    let orientation: RawNapeSnapshot["orientation"];

    try {
      const globalResponse = await this.transport.sendReadCommand(
        globalOrientationCommand(),
      );
      progress("Orientation");

      const perLayer: number[] = [];
      for (let layer = 0; layer < NAPE_LAYER_COUNT; layer += 1) {
        const response = await this.transport.sendReadCommand(
          layerOrientationCommand(layer),
        );
        perLayer.push(response[2]);
        progress(`Layer ${layer} orientation`);
      }

      orientation = {
        global: globalResponse[2],
        perLayer,
      };
    } catch (error) {
      warnings.push(
        `Orientation read was skipped: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }

    return {
      rawSchemaVersion: RAW_NAPE_SNAPSHOT_SCHEMA_VERSION,
      device: this.transport.deviceInfo,
      firmware,
      firmwareCompatibility,
      layerCount: NAPE_LAYER_COUNT,
      keymap,
      encoders,
      dpi: {
        currentLevel,
        levels,
      },
      orientation,
      warnings,
    };
  }
}
