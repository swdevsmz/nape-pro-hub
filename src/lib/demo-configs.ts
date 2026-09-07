export type DeviceMappings = {
  leftTop?: string;
  leftMiddle?: string;
  leftBottom?: string;
  rightTop?: string;
  rightUpperMiddle?: string;
  rightLowerMiddle?: string;
  rightBottom?: string;
};

export type DemoConfig = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  layer: string;
  dpi: number;
  mappings: DeviceMappings;
};

export const demoConfigs: DemoConfig[] = [
  {
    id: "chrome-thumb",
    title: "Chromeを親指だけで操作",
    subtitle: "ブラウザ操作をもっと快適に",
    category: "ブラウザ",
    layer: "Layer 0",
    dpi: 1200,
    mappings: {
      leftTop: "戻る",
      leftMiddle: "左クリック",
      leftBottom: "タブを閉じる",
      rightTop: "Enter",
      rightUpperMiddle: "上スクロール",
      rightLowerMiddle: "下スクロール",
      rightBottom: "右クリック",
    },
  },
  {
    id: "creative-shortcuts",
    title: "制作作業をショートカット",
    subtitle: "よく使う操作をすぐに呼び出し",
    category: "クリエイティブ",
    layer: "Layer 0",
    dpi: 800,
    mappings: {
      leftTop: "取り消し",
      leftMiddle: "ブラシ",
      leftBottom: "色切替",
      rightTop: "Enter",
      rightUpperMiddle: "拡大",
      rightLowerMiddle: "縮小",
      rightBottom: "スポイト",
    },
  },
  {
    id: "video-editing",
    title: "動画編集を効率化",
    subtitle: "カット・再生・書き出しを手元で",
    category: "動画編集",
    layer: "Layer 0",
    dpi: 1600,
    mappings: {
      leftTop: "元に戻す",
      leftMiddle: "再生 / 停止",
      leftBottom: "マーカー",
      rightTop: "Enter",
      rightUpperMiddle: "上スクロール",
      rightLowerMiddle: "下スクロール",
      rightBottom: "カット",
    },
  },
  {
    id: "game-preset",
    title: "ゲーム用プリセット",
    subtitle: "よく使う操作を親指まわりへ",
    category: "ゲーム",
    layer: "Layer 0",
    dpi: 800,
    mappings: {
      leftTop: "スコープ",
      leftMiddle: "しゃがむ",
      leftBottom: "ダッシュ",
      rightTop: "射撃",
      rightUpperMiddle: "武器切替",
      rightLowerMiddle: "リロード",
      rightBottom: "ジャンプ",
    },
  },
];

export function findDemoConfig(id: string) {
  return demoConfigs.find((config) => config.id === id);
}
