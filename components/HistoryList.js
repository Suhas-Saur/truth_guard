"use client";

import { useState } from "react";
import { formatDate, getVerdictTheme, truncateText } from "../lib/utils";

const TYPE_ICONS = {
  "fake-news": "🗞️",
  "website-safety": "🔒",
  "ai-content": "🤖",
  general: "🔍",
};

export default function HistoryList({
  items = [],
  onClear = null,
  isLoading = false,
  showFilter = true,
}) {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div id="history-list" className="glass rounded-2xl p-6 shadow-xl border border-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Scan History
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {items.length} total verification {items.length === 1 ? "record" : "records"}
          </p>
        </div>

        {onClear && items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors self-start sm:self-auto"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {showFilter && items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: "All" },
            { id: "fake-news", label: "Fake News" },
            { id: "website-safety", label: "Web Safety" },
            { id: "ai-content", label: "AI Content" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="animate-spin h-6 w-6 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading history...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="mb-3 text-4xl opacity-60">🗂️</span>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            No history yet
          </p>
          <p className="text-xs mt-1 max-w-sm" style={{ color: "var(--text-muted)" }}>
            Run an analysis using Fake News Detector, Website Safety, or AI Content Detector to see results logged here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5">
          {filteredItems.map((item) => {
            const theme = getVerdictTheme(item.result);
            const badgeClasses = {
              green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
              yellow: "bg-amber-500/15 text-amber-300 border-amber-500/30",
              red: "bg-rose-500/15 text-rose-300 border-rose-500/30",
              indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
            }[theme];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl mt-0.5">{TYPE_ICONS[item.type] || "🔍"}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-indigo-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                      {truncateText(item.query, 65)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {truncateText(item.reason, 90)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClasses}`}>
                    {item.result} {item.score != null ? `(${item.score}%)` : ""}
                  </span>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-white/10 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{TYPE_ICONS[selectedItem.type] || "🔍"}</span>
              <div>
                <h3 className="text-lg font-bold capitalize" style={{ color: "var(--text-primary)" }}>
                  {selectedItem.type.replace("-", " ")} Scan
                </h3>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(selectedItem.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                INPUT QUERY
              </p>
              <p className="text-sm font-mono break-all" style={{ color: "var(--text-primary)" }}>
                {selectedItem.query}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Verdict
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                {selectedItem.result} (Score: {selectedItem.score}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-6">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                ANALYSIS DETAILS
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {selectedItem.reason}
              </p>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full btn-glow py-2.5 rounded-xl text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
