import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NapePro Hub",
  description: "Nape Proの設定を見つけて、共有する非公式ファンサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
