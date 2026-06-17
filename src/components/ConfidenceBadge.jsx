import React from "react";

// Keep old badge for any legacy usage, but primary is ConfidenceRing
export default function ConfidenceBadge({ score, label }) {
  let cls = "";
  if (score >= 80) cls = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
  else if (score >= 60) cls = "bg-purple-500/10 text-purple-400 border border-purple-500/30";
  else cls = "bg-red-500/10 text-red-400 border border-red-500/30";
  return (
    <span className={`inline-flex items-center rounded-full text-[9px] font-mono px-1.5 py-0.5 ${cls}`}>
      {(label || "").toUpperCase()}
    </span>
  );
}
