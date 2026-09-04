"use client";

import { useState, useEffect } from "react";
import HistoryList from "../../components/HistoryList";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/history?limit=100");
      const data = await res.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all verification history?")) return;
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setHistory([]);
      }
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.query?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q) ||
      item.result?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalScans = history.length;
  const safeCount = history.filter((h) => {
    const v = h.result?.toLowerCase() || "";
    return v.includes("safe") || v.includes("real") || v.includes("human");
  }).length;
  const flaggedCount = history.filter((h) => {
    const v = h.result?.toLowerCase() || "";
    return v.includes("fake") || v.includes("suspicious") || v.includes("ai");
  }).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span
            className="mb-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--accent)" }}
          >
            Audit Log &amp; Activity
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Verification History
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            Review past scans, credibility scores, and AI detection diagnostics.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="self-center sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Total Analyses
          </span>
          <p className="text-3xl font-black mt-2 text-white">{totalScans}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Across all categories
          </p>
        </div>

        <div className="glass rounded-2xl p-5 border border-emerald-500/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Credible / Safe / Human
          </span>
          <p className="text-3xl font-black mt-2 text-emerald-300">{safeCount}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Passed verification checks
          </p>
        </div>

        <div className="glass rounded-2xl p-5 border border-rose-500/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Flagged / Suspicious / AI
          </span>
          <p className="text-3xl font-black mt-2 text-rose-300">{flaggedCount}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Identified anomalies or risk
          </p>
        </div>
      </div>

      {/* Search Filter */}
      {history.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search history by keyword, result, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      {/* History List */}
      <HistoryList
        items={filteredHistory}
        isLoading={loading}
        onClear={handleClearHistory}
        showFilter={true}
      />
    </div>
  );
}
