const KEYCODE_LABELS: Record<number, string> = {
  0: "なし",
  40: "Enter",
  41: "Esc",
  43: "Tab",
  44: "Space",
  62: "F5",
  79: "→",
  80: "←",
  169: "音量+",
  170: "音量−",
  209: "左クリック",
  210: "右クリック",
  211: "中クリック",
  212: "戻る",
  213: "進む",
  217: "スクロール↑",
  218: "スクロール↓",
  224: "左Ctrl",
  225: "左Shift",
  21033: "ボールジェスチャ",
  21034: "ボールスクロール",
  21035: "モード/レイヤ",
};

export function formatKeycode(code: number): string {
  return (
    KEYCODE_LABELS[code] ??
    `Unknown 0x${code.toString(16).toUpperCase().padStart(4, "0")}`
  );
}
