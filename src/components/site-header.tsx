import Link from "next/link";

type SiteHeaderProps = {
  active?: "list" | "guide" | "publish";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        NapePro Hub
      </Link>
      <nav className="header-nav" aria-label="メインナビゲーション">
        <Link className={active === "list" ? "active" : ""} href="/">
          設定一覧
        </Link>
        <a className={active === "guide" ? "active" : ""} href="#guide">
          使い方
        </a>
        <Link className={active === "publish" ? "active" : ""} href="/publish">
          公開する
        </Link>
      </nav>
    </header>
  );
}
