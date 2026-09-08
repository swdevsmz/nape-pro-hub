export type FirmwareCompatibility = "verified" | "unverified";

export type NapeDeviceInfo = {
  productName: string;
  vendorId: number;
  productId: number;
};

export type ReadProgress = {
  completed: number;
  total: number;
  label: string;
};

export type DpiLevel = {
  level: number;
  dpi: number;
};

export type DpiSnapshot = {
  currentLevel: number;
  levels: DpiLevel[];
};

export type EncoderSnapshot = {
  ccw: number;
  cw: number;
};

export type OrientationSnapshot = {
  global: number;
  perLayer: number[];
};

export type RawNapeSnapshot = {
  device: NapeDeviceInfo;
  firmware: string;
  firmwareCompatibility: FirmwareCompatibility;
  layerCount: number;
  keymap: number[][];
  encoders: EncoderSnapshot[];
  dpi: DpiSnapshot;
  orientation?: OrientationSnapshot;
  warnings: string[];
};

export type ReadConfigOptions = {
  allowUnverifiedFirmware?: boolean;
  onProgress?: (progress: ReadProgress) => void;
};
