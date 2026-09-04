"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/",               label: "Home",           icon: "🏠" },
  { href: "/fake-news",      label: "Fake News",      icon: "🗞️" },
  { href: "/website-safety", label: "Website Safety", icon: "🔒" },
  { href: "/ai-content",     label: "AI Content",     icon: "🤖" },
  { href: "/history",        label: "History",        icon: "📜" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="glass w-64 flex-shrink-0 hidden md:flex flex-col justify-between"
      style={{ borderRight: "1px solid var(--border)", minHeight: "100%" }}
    >
      <div className="flex flex-col gap-4 p-6">
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "hover:bg-white/5"
                }`}
                style={{ color: isActive ? "#fff" : "var(--text-primary)" }}
              >
                <span className={`text-lg transition-transform duration-200 ${isActive ? "scale-110 opacity-100" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Status Widget */}
      <div className="p-6 border-t border-white/5">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">TruthGuard AI</span>
          </div>
          <p className="text-[11px] leading-tight" style={{ color: "var(--text-muted)" }}>
            Real-time Verification Active
          </p>
        </div>
      </div>
    </aside>
  );
}
