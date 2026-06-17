import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfidenceRing from "./ConfidenceRing";

const smoothSpring = { type: "spring", stiffness: 300, damping: 25, restSpeed: 0.1 };

const DVF_STYLES = {
  DESIRABILITY: {
    label: "DESIRABILITY",
    cls: "text-[#818CF8] bg-indigo-500/[0.08] border border-indigo-500/20",
  },
  VIABILITY: {
    label: "VIABILITY",
    cls: "text-[#34D399] bg-emerald-500/[0.08] border border-emerald-500/20",
  },
  FEASIBILITY: {
    label: "FEASIBILITY",
    cls: "text-[#FB923C] bg-orange-500/[0.08] border border-orange-500/20",
  },
};

export default function AssumptionCard({ assumption, index = 0 }) {
  const [view, setView] = useState("collapsed"); // collapsed | expanded | tested
  const { dimension, assumption_statement, confidence_assessment } = assumption;
  const { confidence_score, contributing_factors } = confidence_assessment || {};

  const dim = (dimension || "DESIRABILITY").toUpperCase();
  const dvf = DVF_STYLES[dim] || DVF_STYLES.DESIRABILITY;

  const cardStyle = {
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  if (view === "tested") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, ...smoothSpring }}
        className="bg-surface border border-white/[0.06] border-l-[3px] border-l-emerald-500/60 rounded-lg mb-3 overflow-hidden"
        style={cardStyle}
      >
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
          <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${dvf.cls}`}>
            {dvf.label}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 px-1.5 py-0.5 rounded">
            NODE_VALIDATED
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-[#62666d] text-sm leading-relaxed line-through">{assumption_statement}</p>
          <button
            onClick={() => setView("collapsed")}
            className="mt-3 text-[9px] font-mono text-[#62666d] hover:text-[#8a8f98] transition-colors cursor-pointer"
          >
            MARK_UNTESTED →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ...smoothSpring }}
      className="bg-surface border border-white/[0.06] rounded-lg mb-3 overflow-hidden"
      style={cardStyle}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01]">
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${dvf.cls}`}>
          {dvf.label}
        </span>
        <ConfidenceRing score={confidence_score} />
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-[#d0d6e0] text-sm leading-relaxed">{assumption_statement}</p>
      </div>

      {/* Footer / expanded content */}
      <AnimatePresence mode="wait">
        {view === "collapsed" ? (
          <div className="px-4 pb-3">
            <button
              onClick={() => setView("expanded")}
              className="text-[9px] font-mono text-[#62666d] hover:text-[#8a8f98] transition-colors cursor-pointer"
            >
              EXPAND_ANALYSIS →
            </button>
          </div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-[9px] font-mono text-[#62666d] mb-3">
                CONFIDENCE_SCORE: {confidence_score}/100
              </p>

              {/* Risk factors */}
              <div className="bg-black/30 rounded-md p-3 mb-3 border border-white/[0.04]">
                <p className="text-[9px] font-mono text-[#62666d] mb-2">RISK_FACTORS:</p>
                {(contributing_factors || []).map((f, i) => (
                  <p key={i} className="text-[#8a8f98] text-xs font-mono leading-relaxed">
                    {"  > "}{f}
                  </p>
                ))}
              </div>

              {/* How to test */}
              <div className="bg-black/30 rounded-md p-3 mb-3 border border-white/[0.04]">
                <p className="text-[9px] font-mono text-[#62666d] mb-1">HOW_TO_TEST:</p>
                <p className="text-[#d0d6e0] text-xs leading-relaxed">
                  Talk to 3 real people who match your target. Ask: "Walk me through the last time you had this problem. What did you do?" Don't mention your idea.
                </p>
              </div>

              {/* Action row */}
              <div className="flex gap-2">
                <button
                  onClick={() => setView("collapsed")}
                  className="flex-1 h-7 text-[10px] font-mono text-[#62666d] hover:text-[#8a8f98] border border-white/[0.06] rounded-md transition-colors cursor-pointer"
                >
                  COLLAPSE_NODE
                </button>
                <button
                  onClick={() => setView("tested")}
                  className="flex-1 h-7 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/[0.06] transition-colors cursor-pointer"
                >
                  MARK_TESTED ✓
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
