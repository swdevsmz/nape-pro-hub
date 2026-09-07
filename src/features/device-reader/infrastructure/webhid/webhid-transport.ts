import {
  HID_PACKET_SIZE,
  HID_REPORT_ID,
  isAllowedReadPacket,
  NAPE_PRODUCT_ID,
  NAPE_USAGE_PAGE,
  NAPE_VENDOR_ID,
  type ReadCommand,
} from "../../domain/protocol";
import type { HidTransport } from "../../domain/nape-device-reader";
import type { NapeDeviceInfo } from "../../domain/types";
import {
  getWebHidManager,
  type WebHidDevice,
  type WebHidInputReportEvent,
} from "./webhid-types";

const DEFAULT_TIMEOUT_MS = 1500;

export class ReadOnlyCommandRejectedError extends Error {
  constructor(command: readonly number[]) {
    super(
      `Blocked HID packet outside read-only allowlist: ${command
        .map((value) => `0x${value.toString(16).padStart(2, "0")}`)
        .join(" ")}`,
    );
    this.name = "ReadOnlyCommandRejectedError";
  }
}

export class WebHidUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebHidUnavailableError";
  }
}

function isNapeRawHidDevice(device: WebHidDevice): boolean {
  return (
    device.vendorId === NAPE_VENDOR_ID &&
    device.productId === NAPE_PRODUCT_ID &&
    device.collections.some(
      (collection) => collection.usagePage === NAPE_USAGE_PAGE,
    )
  );
}

function responseMatches(
  request: Uint8Array,
  response: Uint8Array,
): boolean {
  if (response[0] !== request[0]) {
    return false;
  }

  if (request[0] === 0xa7) {
    if (response[1] !== request[1]) {
      return false;
    }

    if (
      (request[1] === 0x24 || request[1] === 0x38) &&
      response[2] !== request[2]
    ) {
      return false;
    }

    return true;
  }

  if (request[0] === 0x04 || request[0] === 0x14) {
    return (
      response[1] === request[1] &&
      response[2] === request[2] &&
      response[3] === request[3]
    );
  }

  return true;
}

export class WebHidReadOnlyTransport implements HidTransport {
  readonly deviceInfo: NapeDeviceInfo;

  constructor(private readonly device: WebHidDevice) {
    this.deviceInfo = {
      productName: device.productName || "Keychron Nape Pro",
      vendorId: device.vendorId,
      productId: device.productId,
    };
  }

  async ensureOpen(): Promise<void> {
    if (!this.device.opened) {
      await this.device.open();
    }
  }

  async sendReadCommand(command: ReadCommand): Promise<Uint8Array> {
    if (!isAllowedReadPacket(command.bytes)) {
      throw new ReadOnlyCommandRejectedError(command.bytes);
    }

    if (command.bytes.length > HID_PACKET_SIZE) {
      throw new Error("HID command exceeds the 32-byte report size.");
    }

    await this.ensureOpen();

    const packet = new Uint8Array(HID_PACKET_SIZE);
    command.bytes.forEach((value, index) => {
      packet[index] = value;
    });

    return new Promise<Uint8Array>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        this.device.removeEventListener("inputreport", handleInputReport);
        window.clearTimeout(timer);
      };

      const finish = (
        callback: () => void,
      ) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        callback();
      };

      const handleInputReport = (event: WebHidInputReportEvent) => {
        const response = new Uint8Array(
          event.data.buffer,
          event.data.byteOffset,
          event.data.byteLength,
        );

        if (!responseMatches(packet, response)) {
          return;
        }

        finish(() => resolve(Uint8Array.from(response)));
      };

      const timer = window.setTimeout(() => {
        finish(() =>
          reject(
            new Error(
              `${command.label} timed out after ${
                command.timeoutMs ?? DEFAULT_TIMEOUT_MS
              } ms.`,
            ),
          ),
        );
      }, command.timeoutMs ?? DEFAULT_TIMEOUT_MS);

      this.device.addEventListener("inputreport", handleInputReport);

      this.device.sendReport(HID_REPORT_ID, packet).catch((error) => {
        finish(() =>
          reject(
            error instanceof Error
              ? error
              : new Error("Failed to send WebHID report."),
          ),
        );
      });
    });
  }
}

export async function requestNapeProTransport(): Promise<WebHidReadOnlyTransport> {
  if (typeof window === "undefined") {
    throw new WebHidUnavailableError("WebHID is available only in the browser.");
  }

  if (!window.isSecureContext) {
    throw new WebHidUnavailableError(
      "WebHID requires a secure context. Open this site with https:// or http://localhost.",
    );
  }

  const hid = getWebHidManager();

  if (!hid) {
    throw new WebHidUnavailableError(
      "This browser does not expose WebHID. Use a compatible desktop Chromium browser.",
    );
  }

  const alreadyGranted = (await hid.getDevices()).find(isNapeRawHidDevice);

  const device =
    alreadyGranted ??
    (
      await hid.requestDevice({
        filters: [
          {
            vendorId: NAPE_VENDOR_ID,
            productId: NAPE_PRODUCT_ID,
          },
        ],
      })
    ).find(isNapeRawHidDevice);

  if (!device) {
    throw new WebHidUnavailableError(
      "Nape Proの設定通信用HIDインターフェース (usagePage 0xFF60) が見つかりませんでした。",
    );
  }

  const transport = new WebHidReadOnlyTransport(device);
  await transport.ensureOpen();
  return transport;
}
