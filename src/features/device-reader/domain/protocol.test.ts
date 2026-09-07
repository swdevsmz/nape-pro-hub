import { describe, expect, it } from "vitest";

import {
  decodeFirmware,
  isAllowedReadPacket,
  readU16Be,
  readU16Le,
} from "./protocol";

describe("read-only HID protocol guard", () => {
  it.each([
    [0xa1],
    [0x04, 0, 0, 0],
    [0x14, 0, 0, 0],
    [0xa7, 0x20],
    [0xa7, 0x21],
    [0xa7, 0x24, 0],
    [0xa7, 0x38, 0],
  ])("allows GET packet %j", (packet) => {
    expect(isAllowedReadPacket(packet)).toBe(true);
  });

  it.each([
    [0x05, 0, 0, 0, 0, 0],
    [0x13, 0, 0],
    [0x15, 0, 0, 0, 0, 0],
    [0xa7, 0x22, 0],
    [0xa7, 0x23, 0, 0, 0],
    [0xa7, 0x25, 0, 0, 0],
    [0xa7, 0x27, 0],
    [0xa7, 0x29, 0],
    [0xa7, 0x2d, 0],
    [0xa7, 0x34, 0],
    [0xa7, 0x39, 0, 0],
  ])("rejects write packet %j", (packet) => {
    expect(isAllowedReadPacket(packet)).toBe(false);
  });
});

describe("protocol decoders", () => {
  it("decodes firmware text after the command byte", () => {
    const packet = new Uint8Array([
      0xa1,
      ..."v1.2.5-ZK".split("").map((char) => char.charCodeAt(0)),
      0,
      0,
    ]);

    expect(decodeFirmware(packet)).toBe("v1.2.5-ZK");
  });

  it("decodes u16 values in both byte orders", () => {
    const bytes = new Uint8Array([0x34, 0x12, 0xab, 0xcd]);

    expect(readU16Le(bytes, 0)).toBe(0x1234);
    expect(readU16Be(bytes, 2)).toBe(0xabcd);
  });
});
