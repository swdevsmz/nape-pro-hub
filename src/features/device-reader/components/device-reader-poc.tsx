"use client";

import { useMemo, useState } from "react";

import { formatKeycode } from "../domain/keycode-labels";
import {
  NapeDeviceReader,
  UnverifiedFirmwareError,
} from "../domain/nape-device-reader";
import type { RawNapeSnapshot, ReadProgress } from "../domain/types";
import {
  requestNapeProTransport,
  type WebHidReadOnlyTransport,
} from "../infrastructure/webhid/webhid-transport";

type PocStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reading"
  | "unverified"
  | "success"
  | "error";

export function DeviceReaderPoc() {
  const [transport, setTransport] =
    useState<WebHidReadOnlyTransport | null>(null);
  const [status, setStatus] = useState<PocStatus>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<ReadProgress | null>(null);
  const [snapshot, setSnapshot] = useState<RawNapeSnapshot | null>(null);

  const environment = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return {
      secure: window.isSecureContext,
      webHid: "hid" in navigator,
      origin: window.location.origin,
    };
  }, []);

  async function connect() {
    setStatus("connecting");
    setMessage("");
    setSnapshot(null);
    setProgress(null);

    try {
      const nextTransport = await requestNapeProTransport();
      setTransport(nextTransport);
      setStatus("connected");
      setMessage(
        `${nextTransport.deviceInfo.productName} に接続しました。次に読み取りを開始してください。`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "接続に失敗しました。",
      );
    }
  }

  async function readConfig(allowUnverifiedFirmware: boolean) {
    if (!transport) {
      return;
    }

    setStatus("reading");
    setMessage("");
    setSnapshot(null);
    setProgress(null);

    try {
      const reader = new NapeDeviceReader(transport);
      const nextSnapshot = await reader.readConfig({
        allowUnverifiedFirmware,
        onProgress: setProgress,
      });

      setSnapshot(nextSnapshot);
      setStatus("success");
      setMessage(
        nextSnapshot.firmwareCompatibility === "verified"
          ? "読み取りが完了しました。"
          : "未検証FirmwareでGET-only読み取りが完了しました。Launcher上の設定が変わっていないことを確認してください。",
      );
    } catch (error) {
      if (error instanceof UnverifiedFirmwareError) {
        setStatus("unverified");
        setMessage(
          `Firmware「${error.firmware || "不明"}」は既存OSSで未検証です。通常フローはここで停止しました。PoCではGET-only制約のまま明示的に続行できます。`,
        );
        return;
      }

      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "読み取りに失敗しました。",
      );
    }
  }

  return (
    <div className="poc-stack">
      <section className="poc-notice">
        <div>
          <strong>Read-only PoC</strong>
          <p>
            この画面はNape Proへ設定を書き込みません。送信できるHIDコマンドを
            GET系allowlistに限定しています。
          </p>
        </div>
        <span className="poc-readonly-badge">WRITE無効</span>
      </section>

      {environment && (
        <section
          className={
            environment.secure && environment.webHid
              ? "poc-environment"
              : "poc-environment poc-environment-warning"
          }
        >
          <dl>
            <div>
              <dt>Origin</dt>
              <dd>{environment.origin}</dd>
            </div>
            <div>
              <dt>Secure Context</dt>
              <dd>{environment.secure ? "OK" : "NG"}</dd>
            </div>
            <div>
              <dt>WebHID</dt>
              <dd>{environment.webHid ? "利用可能" : "利用不可"}</dd>
            </div>
          </dl>

          {!environment.secure && (
            <p>
              WebHIDはSecure Context必須です。同じPCで試す場合は
              <code>http://localhost:3000</code>
              で開いてください。LANのIPアドレスをHTTPで開いた状態では利用できません。
            </p>
          )}
        </section>
      )}

      <section className="reader-card poc-reader-card">
        <h2>1. Nape Proへ接続</h2>
        <p>
          USB ModeでNape Proを接続し、ブラウザのデバイス選択画面からNape
          Proを選びます。
        </p>

        <button
          className="primary-button"
          disabled={status === "connecting" || status === "reading"}
          onClick={connect}
          type="button"
        >
          {status === "connecting"
            ? "接続中..."
            : transport
              ? "Nape Proを選び直す"
              : "Nape Proを選択して接続"}
        </button>

        {transport && (
          <div className="poc-device-summary">
            <strong>{transport.deviceInfo.productName}</strong>
            <span>
              VID 0x{transport.deviceInfo.vendorId.toString(16).toUpperCase()} /
              PID 0x{transport.deviceInfo.productId.toString(16).toUpperCase()}
            </span>
          </div>
        )}
      </section>

      <section className="reader-card poc-reader-card">
        <h2>2. 設定を読み取る</h2>
        <p>
          Firmware → Layer/Keymap → Encoder → DPI →
          Orientationの順に読み取ります。
        </p>

        <button
          className="primary-button"
          disabled={!transport || status === "reading"}
          onClick={() => readConfig(false)}
          type="button"
        >
          {status === "reading" ? "読み取り中..." : "安全に読み取りを開始"}
        </button>

        {status === "unverified" && (
          <button
            className="secondary-danger-button"
            onClick={() => readConfig(true)}
            type="button"
          >
            未検証FWでGET-only読み取りを続ける
          </button>
        )}

        {progress && status === "reading" && (
          <div className="poc-progress">
            <div>
              <span>{progress.label}</span>
              <span>
                {progress.completed} / {progress.total}
              </span>
            </div>
            <progress max={progress.total} value={progress.completed} />
          </div>
        )}

        {message && (
          <p
            className={
              status === "error" || status === "unverified"
                ? "poc-message poc-message-warning"
                : "poc-message"
            }
          >
            {message}
          </p>
        )}
      </section>

      {snapshot && (
        <section className="poc-result">
          <div className="poc-result-heading">
            <div>
              <span>読み取り結果</span>
              <h2>{snapshot.device.productName}</h2>
            </div>
            <span
              className={
                snapshot.firmwareCompatibility === "verified"
                  ? "compatibility-badge"
                  : "compatibility-badge compatibility-badge-warning"
              }
            >
              {snapshot.firmwareCompatibility === "verified"
                ? "検証済みFW"
                : "未検証FW"}
            </span>
          </div>

          <dl className="poc-summary-grid">
            <div>
              <dt>Firmware</dt>
              <dd>{snapshot.firmware || "取得できませんでした"}</dd>
            </div>
            <div>
              <dt>Layer</dt>
              <dd>{snapshot.layerCount}</dd>
            </div>
            <div>
              <dt>Current DPI</dt>
              <dd>
                {snapshot.dpi.levels.find(
                  (item) => item.level === snapshot.dpi.currentLevel,
                )?.dpi ?? "-"}
              </dd>
            </div>
            <div>
              <dt>Orientation</dt>
              <dd>
                {snapshot.orientation
                  ? `${snapshot.orientation.global * 45}°`
                  : "未取得"}
              </dd>
            </div>
          </dl>

          <div className="poc-table-wrap">
            <table className="poc-keymap-table">
              <thead>
                <tr>
                  <th>Layer</th>
                  {Array.from({ length: 7 }, (_, index) => (
                    <th key={index}>Key {index}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshot.keymap.map((layer, layerIndex) => (
                  <tr key={layerIndex}>
                    <th>Layer {layerIndex}</th>
                    {layer.map((keycode, colIndex) => (
                      <td key={colIndex}>
                        <strong>{formatKeycode(keycode)}</strong>
                        <small>{keycode}</small>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="poc-raw-result">
            <summary>診断用JSONを見る</summary>
            <pre>{JSON.stringify(snapshot, null, 2)}</pre>
          </details>
        </section>
      )}
    </div>
  );
}
