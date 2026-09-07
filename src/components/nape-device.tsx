import type { DeviceMappings } from "@/lib/demo-configs";

type NapeDeviceProps = {
  mappings: DeviceMappings;
  size?: "card" | "detail";
};

function Label({ value }: { value?: string }) {
  return value ? <span className="device-label">{value}</span> : <span />;
}

export function NapeDevice({ mappings, size = "card" }: NapeDeviceProps) {
  return (
    <div className={`device-map device-map-${size}`}>
      <div className="device-label-column">
        <Label value={mappings.leftTop} />
        <Label value={mappings.leftMiddle} />
        <Label value={mappings.leftBottom} />
      </div>

      <div className="nape-device" aria-label="Nape Pro キー配置図">
        <div className="device-wordmark">NapePro</div>
        <div className="device-top-buttons">
          <span />
          <span />
        </div>
        <div className="trackball-shell">
          <div className="trackball" />
        </div>
        <div className="device-bottom-buttons">
          <span>M1</span>
          <span>M2</span>
        </div>
      </div>

      <div className="device-label-column">
        <Label value={mappings.rightTop} />
        <Label value={mappings.rightUpperMiddle} />
        <Label value={mappings.rightLowerMiddle} />
        <Label value={mappings.rightBottom} />
      </div>
    </div>
  );
}
