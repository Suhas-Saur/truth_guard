"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/fake-news", label: "Fake News" },
    { href: "/website-safety", label: "Website Safety" },
    { href: "/ai-content", label: "AI Content" },
    { href: "/history", label: "History" },
  ];

  return (
    <header
      className="glass sticky top-0 z-40 w-full backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex w-full items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <Link
          id="nav-brand"
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <span className="text-2xl">🛡️</span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
          >
            TruthGuard
          </span>
          <span style={{ color: "var(--text-primary)" }}>AI</span>
        </Link>

        {/* Top Nav for Mobile & Desktop */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-white font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/fake-news"
            className="hidden sm:inline-flex btn-glow px-4 py-1.5 rounded-xl text-xs font-bold text-white tracking-wide"
          >
            + Start Scan
          </Link>
        </div>
      </div>
    </header>
  );
}
