/**
 * General helper functions for TruthGuard AI
 */

export function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function truncateText(text, max = 80) {
  if (!text || typeof text !== "string") return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export function getVerdictTheme(verdict) {
  if (!verdict) return "indigo";
  const v = verdict.toLowerCase();
  if (v.includes("safe") || v.includes("real") || v.includes("human")) {
    return "green";
  }
  if (v.includes("uncertain") || v.includes("mixed") || v.includes("unverified")) {
    return "yellow";
  }
  if (v.includes("fake") || v.includes("suspicious") || v.includes("ai") || v.includes("malicious")) {
    return "red";
  }
  return "indigo";
}
