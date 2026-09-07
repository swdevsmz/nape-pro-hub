export type WebHidCollectionInfo = {
  usagePage: number;
  usage: number;
};

export type WebHidInputReportEvent = Event & {
  data: DataView;
  reportId: number;
};

export interface WebHidDevice extends EventTarget {
  readonly opened: boolean;
  readonly vendorId: number;
  readonly productId: number;
  readonly productName: string;
  readonly collections: readonly WebHidCollectionInfo[];

  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: BufferSource): Promise<void>;

  addEventListener(
    type: "inputreport",
    listener: (event: WebHidInputReportEvent) => void,
  ): void;

  removeEventListener(
    type: "inputreport",
    listener: (event: WebHidInputReportEvent) => void,
  ): void;
}

export type WebHidDeviceFilter = {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
};

export interface WebHidManager {
  getDevices(): Promise<WebHidDevice[]>;
  requestDevice(options: {
    filters: WebHidDeviceFilter[];
  }): Promise<WebHidDevice[]>;
}

export function getWebHidManager(): WebHidManager | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return (navigator as Navigator & { hid?: WebHidManager }).hid;
}
