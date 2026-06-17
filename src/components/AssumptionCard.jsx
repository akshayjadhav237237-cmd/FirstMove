import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfidenceBadge from "./ConfidenceBadge";

export default function AssumptionCard({ assumption, index = 0 }) {
  const [view, setView] = useState("collapsed");
  const { dimension, assumption_statement, confidence_assessment } = assumption;
  const { confidence_score, qualitative_label, contributing_factors } = confidence_assessment;

  const dim = (dimension || "").toUpperCase();
  let dvfCls = "";
  if (dim === "DESIRABILITY") dvfCls = "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";
  else if (dim === "VIABILITY") dvfCls = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  else if (dim === "FEASIBILITY") dvfCls = "bg-orange-500/15 text-orange-400 border border-orange-500/30";

  const label = dim.charAt(0) + dim.slice(1).toLowerCase();

  const cardBase = "rounded-xl p-4 mb-3 transition-all duration-200";

  if (view === "tested") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`${cardBase} border border-emerald-500/30 bg-emerald-500/5`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${dvfCls}`}>{label}</span>
          <ConfidenceBadge score={confidence_score} label={qualitative_label} />
        </div>
        <p className="line-through text-muted text-sm mt-1 mb-2 leading-relaxed">{assumption_statement}</p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 text-xs font-medium">✓ Tested</span>
          <button onClick={() => setView("collapsed")} className="text-muted text-xs underline hover:text-white/60 transition">Untested</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => view === "collapsed" && setView("expanded")}
      className={`${cardBase} bg-card border border-white/8 ${view === "collapsed" ? "cursor-pointer hover:border-white/15" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${dvfCls}`}>{label}</span>
        <ConfidenceBadge score={confidence_score} label={qualitative_label} />
      </div>
      <p className="text-white text-sm mt-1 mb-2 leading-relaxed">{assumption_statement}</p>

      {view === "collapsed" && (
        <span className="text-muted text-xs">Tap to see how to test this ↓</span>
      )}

      <AnimatePresence>
        {view === "expanded" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-secondary text-xs mt-3 mb-3 font-medium">
              Confidence: {confidence_score}/100
            </p>
            <div className="bg-input-bg rounded-lg p-3 mb-3">
              <p className="text-muted text-xs mb-2 font-medium">Why this score:</p>
              {contributing_factors.map((f, i) => (
                <p key={i} className="text-secondary text-xs mb-1">• {f}</p>
              ))}
            </div>
            <div className="bg-input-bg rounded-lg p-3 mb-3">
              <p className="text-muted text-xs mb-1 font-medium">How to test this:</p>
              <p className="text-white text-xs leading-relaxed">
                Talk to 3 real people. Ask them: "Walk me through the last time you faced this problem. What did you do about it?"
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setView("collapsed"); }} className="flex-1 border border-white/10 rounded-lg py-2 text-xs text-muted hover:text-secondary transition">↑ Collapse</button>
              <button onClick={(e) => { e.stopPropagation(); setView("tested"); }} className="flex-1 border border-emerald-500/30 rounded-lg py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 transition">Mark as Tested ✓</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
