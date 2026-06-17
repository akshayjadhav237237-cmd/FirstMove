import React from "react";

export default function ConfidenceBadge({ score, label }) {
  let styles = "";
  let emoji = "";

  if (score >= 80) {
    styles = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    emoji = "😊";
  } else if (score >= 60) {
    styles = "bg-amber-500/10 text-amber-400 border border-amber-500/30";
    emoji = "😐";
  } else {
    styles = "bg-red-500/10 text-red-400 border border-red-500/30";
    emoji = "😕";
  }

  // Ensure qualitative label is printed cleanly, e.g. "HIGH", "MODERATE", "LOW"
  const formattedLabel = (label || "").toUpperCase();

  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-xs px-2 py-0.5 font-medium ${styles}`}>
      <span>{emoji}</span>
      <span>{formattedLabel}</span>
    </span>
  );
}
