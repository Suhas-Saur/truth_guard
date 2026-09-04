"use client";

import { useState } from "react";

/**
 * ResultCard — Displays AI verification results with confidence meters and action options.
 */
export default function ResultCard({ title, verdict, score, details }) {
  const [copied, setCopied] = useState(false);

  // Determine color theme based on verdict
  let theme = "indigo";
  const v = verdict?.toLowerCase() || "";

  if (v.includes("safe") || v.includes("real") || v.includes("human")) {
    theme = "green";
  } else if (v.includes("uncertain")) {
    theme = "yellow";
  } else if (v.includes("fake") || v.includes("suspicious") || v.includes("ai")) {
    theme = "red";
  }

  const badgeColors = {
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20",
    yellow: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20",
    red: "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20",
    indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20",
  };

  const progressColors = {
    green: "from-emerald-400 to-teal-400",
    yellow: "from-amber-400 to-orange-400",
    red: "from-rose-500 to-red-600",
    indigo: "from-indigo-400 to-purple-500",
  };

  const borderOutline = {
    green: "border-emerald-500/30 shadow-emerald-500/5",
    yellow: "border-amber-500/30 shadow-amber-500/5",
    red: "border-rose-500/30 shadow-rose-500/5",
    indigo: "border-indigo-500/30 shadow-indigo-500/5",
  };

  const handleCopy = () => {
    const textToCopy = `TruthGuard Analysis: ${title}\nVerdict: ${verdict} (Score: ${score}%)\nDetails: ${details}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      id="result-card"
      className={`glass rounded-2xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 ${borderOutline[theme]}`}
      role="region"
      aria-label="Analysis Result"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title ?? "Analysis Result"}
          </h3>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Automatically logged to your verification history
          </span>
        </div>

        {verdict && (
          <span
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider border shadow-md self-start sm:self-auto ${badgeColors[theme]}`}
          >
            {verdict}
          </span>
        )}
      </div>

      {/* Score bar */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          <span>Confidence Score</span>
          <span className="text-white font-mono">{score != null ? `${score}%` : "—"}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-black/40 shadow-inner p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${progressColors[theme]}`}
            style={{ width: score != null ? `${score}%` : "0%" }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl bg-white/[0.03] p-4 sm:p-5 border border-white/10 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-indigo-400">
          Reasoning &amp; Assessment
        </p>
        <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: "var(--text-primary)" }}>
          {details ?? "Run an analysis to see results here."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
        >
          {copied ? "✓ Copied to Clipboard" : "📋 Copy Report"}
        </button>
      </div>
    </div>
  );
}
