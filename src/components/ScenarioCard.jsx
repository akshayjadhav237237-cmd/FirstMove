import React from "react";
import { motion } from "motion/react";

const smoothSpring = { type: "spring", stiffness: 300, damping: 25, restSpeed: 0.1 };

const SCENARIO_CONFIG = {
  optimistic: {
    mono:   "OPTIMISTIC_PATH",
    accent: "#10B981",
    borderCls: "border-l-emerald-500",
    barCls: "bg-emerald-500",
  },
  neutral: {
    mono:   "NEUTRAL_PATH",
    accent: "#9CA3AF",
    borderCls: "border-l-gray-500",
    barCls: "bg-gray-500",
  },
  pessimistic: {
    mono:   "RISK_PATH",
    accent: "#EF4444",
    borderCls: "border-l-red-500",
    barCls: "bg-red-500",
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
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, ...smoothSpring }}
      className={`bg-surface border border-white/[0.06] border-l-[3px] ${cfg.borderCls} rounded-lg p-4 mb-3`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-[#62666d] uppercase tracking-widest">
          {cfg.mono}
        </span>
        <span className="text-[9px] font-mono text-[#8a8f98]">
          {probability}% PROBABILITY
        </span>
      </div>

      {/* Headline */}
      <p className="text-[#f7f8f8] text-sm font-medium leading-snug mt-2 mb-3">
        {data.headline}
      </p>

      {/* Key conditions */}
      <div className="mb-3 space-y-1">
        {(data.key_conditions || []).map((cond, i) => (
          <p key={i} className="text-[#8a8f98] text-xs">· {cond}</p>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.04] pt-3 mt-2 flex items-center justify-between">
        <span className="text-[9px] font-mono text-[#62666d]">
          EST_TIMELINE: {data.estimated_timeline}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#62666d]">IMPACT</span>
          <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${impactPct}%` }}
              transition={{ delay: delay + 0.4, duration: 0.9, ease: "easeOut" }}
              className={`h-full rounded-full ${cfg.barCls}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
