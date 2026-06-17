import React from "react";
import { motion } from "framer-motion";

const SCENARIO_CONFIG = {
  optimistic: {
    label: "Optimistic",
    emoji: "🟢",
    color: "#10B981",
    glowColor: "rgba(16,185,129,0.15)",
    bgColor:   "rgba(16,185,129,0.05)",
    borderColor: "rgba(16,185,129,0.3)",
  },
  neutral: {
    label: "Neutral",
    emoji: "🟡",
    color: "#9CA3AF",
    glowColor: "rgba(156,163,175,0.15)",
    bgColor:   "rgba(156,163,175,0.05)",
    borderColor: "rgba(156,163,175,0.3)",
  },
  pessimistic: {
    label: "Pessimistic",
    emoji: "🔴",
    color: "#EF4444",
    glowColor: "rgba(239,68,68,0.15)",
    bgColor:   "rgba(239,68,68,0.05)",
    borderColor: "rgba(239,68,68,0.3)",
  },
};

export default function ScenarioCard({ type, data, delay = 0 }) {
  const cfg = SCENARIO_CONFIG[type] || SCENARIO_CONFIG.neutral;
  if (!data) return null;

  const probability = Math.round((data.probability || 0) * 100);
  const impact = Math.min(10, Math.max(0, data.impact_score || 0));
  const impactPct = (impact / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="rounded-xl p-5"
      style={{
        border: `1px solid ${cfg.borderColor}`,
        background: cfg.bgColor,
        boxShadow: `0 0 20px ${cfg.glowColor}`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-white text-sm font-semibold">
          {cfg.emoji} {cfg.label}
        </span>
        <span className="bg-white/5 text-secondary text-xs rounded-full px-2 py-0.5">
          {probability}% likely
        </span>
      </div>

      {/* Headline */}
      <p className="text-white text-sm font-medium mb-3 leading-snug">{data.headline}</p>

      {/* Key conditions */}
      <div className="mb-3 space-y-1">
        {(data.key_conditions || []).map((cond, i) => (
          <p key={i} className="text-secondary text-xs">· {cond}</p>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/8">
        <span className="text-muted text-xs">Timeline: {data.estimated_timeline}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Impact</span>
          <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${impactPct}%` }}
              transition={{ delay: delay + 0.4, duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
