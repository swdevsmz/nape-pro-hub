import { describe, expect, it } from "vitest";

import { NapeDeviceReader, type HidTransport } from "./nape-device-reader";
import type { ReadCommand } from "./protocol";

function firmwareResponse(text = "v1.2.5-ZK") {
  const response = new Uint8Array(32);
  response[0] = 0xa1;
  text.split("").forEach((char, index) => {
    response[index + 1] = char.charCodeAt(0);
  });
  return response;
}

class FakeReadOnlyTransport implements HidTransport {
  readonly deviceInfo = {
    productName: "Keychron Nape Pro",
    vendorId: 13364,
    productId: 1088,
  };

  async sendReadCommand(command: ReadCommand): Promise<Uint8Array> {
    const response = new Uint8Array(32);
    const [group, subcommand, arg2, arg3] = command.bytes;

    if (group === 0xa1) {
      return firmwareResponse();
    }

    response[0] = group;

    if (group === 0x04) {
      response[1] = subcommand;
      response[2] = arg2;
      response[3] = arg3;
      const keycode = 200 + subcommand * 10 + arg3;
      response[4] = (keycode >> 8) & 0xff;
      response[5] = keycode & 0xff;
      return response;
    }

    if (group === 0x14) {
      response[1] = subcommand;
      response[2] = arg2;
      response[3] = arg3;
      const keycode = 300 + subcommand * 10 + arg3;
      response[4] = (keycode >> 8) & 0xff;
      response[5] = keycode & 0xff;
      return response;
    }

    response[1] = subcommand;

    if (group === 0xa7 && subcommand === 0x21) {
      response[2] = 2;
      return response;
    }

    if (group === 0xa7 && subcommand === 0x24) {
      const dpi = [400, 800, 1600, 3200, 4000][arg2];
      response[2] = dpi & 0xff;
      response[3] = (dpi >> 8) & 0xff;
      return response;
    }

    if (group === 0xa7 && subcommand === 0x20) {
      response[2] = 2;
      return response;
    }

    if (group === 0xa7 && subcommand === 0x38) {
      response[2] = arg2;
      return response;
    }

    throw new Error(`Unexpected command: ${command.bytes.join(",")}`);
  }
}

describe("NapeDeviceReader", () => {
  it("reconstructs required settings from a read-only transport", async () => {
    const reader = new NapeDeviceReader(new FakeReadOnlyTransport());
    const snapshot = await reader.readConfig();

    expect(snapshot.firmware).toBe("v1.2.5-ZK");
    expect(snapshot.firmwareCompatibility).toBe("verified");
    expect(snapshot.layerCount).toBe(9);
    expect(snapshot.keymap).toHaveLength(9);
    expect(snapshot.keymap[0]).toHaveLength(7);
    expect(snapshot.keymap[0][0]).toBe(200);
    expect(snapshot.encoders).toHaveLength(9);
    expect(snapshot.encoders[0]).toEqual({ ccw: 300, cw: 301 });
    expect(snapshot.dpi.currentLevel).toBe(2);
    expect(snapshot.dpi.levels.map((level) => level.dpi)).toEqual([
      400,
      800,
      1600,
      3200,
      4000,
    ]);
    expect(snapshot.orientation?.global).toBe(2);
  });
});
