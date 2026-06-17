import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function getMomTestQuestion(dim, statement) {
  const s = (statement || "").toLowerCase();
  if (s.includes("landlord")) {
    if (dim === "DESIRABILITY") return "Talk to 3 landlords. Ask: 'How did you find your last remote tenant? Walk me through the process from listing to contract.'";
    if (dim === "VIABILITY") return "Talk to 3 landlords. Ask: 'What tools or packages do you currently pay for to list or manage your properties? What does it cost?'";
    return "Film a quick video of your own room under 3 lighting conditions. Ask: 'Is this quality clear enough to make a rental decision?'";
  }
  if (s.includes("student") || s.includes("internship")) {
    if (dim === "DESIRABILITY") return "Talk to 3 students. Ask: 'How do you keep track of your internship applications today? What happened the last time you missed a deadline?'";
    if (dim === "VIABILITY") return "Talk to 3 students. Ask: 'What productivity tools (like Notion or Spotify) do you pay for yourself? What would make this tool worth paying for?'";
    return "Build a single-page tracker in Notion/Sheets. Send it to 5 students and observe if they use it for their active listings.";
  }
  
  if (dim === "DESIRABILITY") {
    return `Talk to 3 target users. Ask: "Walk me through the last time you faced this problem. What did you do to solve it? (Do not mention your idea)."`;
  }
  if (dim === "VIABILITY") {
    return `Talk to 3 target users. Ask: "What are you currently spending (in time or money) to deal with this? What makes that cost acceptable or unacceptable?"`;
  }
  return `Run a manual test (a Concierge or Wizard of Oz test) for one user. Ask: "Did the manual workflow solve your core problem?"`;
}

const DVF_STYLES = {
  DESIRABILITY: {
    label: "DESIRABILITY",
    cls: "text-indigo-300 bg-indigo-500/10 border border-indigo-400/20",
  },
  VIABILITY: {
    label: "VIABILITY",
    cls: "text-emerald-300 bg-emerald-500/10 border border-emerald-400/20",
  },
  FEASIBILITY: {
    label: "FEASIBILITY",
    cls: "text-orange-300 bg-orange-500/10 border border-orange-400/20",
  },
};

export default function AssumptionCard({ assumption, isTested, onToggleTested, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const { id, dimension, assumption_statement, confidence_assessment } = assumption;
  const { confidence_score, contributing_factors } = confidence_assessment || {};

  const dim = (dimension || "DESIRABILITY").toUpperCase();
  const dvf = DVF_STYLES[dim] || DVF_STYLES.DESIRABILITY;

  return (
    <div
      className={`cyber-panel mb-3 overflow-hidden transition-all duration-200 ${
        isTested 
          ? "border-l-2 border-l-emerald-400/50 opacity-40" 
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/5">
        <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${dvf.cls}`}>
          {dvf.label}
        </span>
        <span className="text-white/40 text-xs font-mono">
          CONFIDENCE_METRIC: {confidence_score}%
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <p className={`text-white/60 text-xs leading-relaxed ${isTested ? "line-through" : ""}`}>
          {assumption_statement}
        </p>

        {/* Collapsed / Expanded sections */}
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="bg-[#080710]/60 border border-white/5 rounded-xl p-3.5 mt-2 space-y-3">
                {/* Contributing factors */}
                <div>
                  <span className="mono-label text-[8px] text-white/30 block mb-1.5 font-bold">
                    Risk Factors
                  </span>
                  <div className="space-y-1">
                    {(contributing_factors || []).map((factor, i) => (
                      <div key={i} className="text-white/50 text-[10px] font-mono leading-relaxed">
                        {"▸ "}{factor}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mom Test method */}
                <div className="border-t border-white/5 pt-2.5">
                  <span className="mono-label text-[8px] text-white/30 block mb-1.5 font-bold">
                    Validation Method (Mom Test)
                  </span>
                  <p className="text-white/60 text-[10px] leading-relaxed">
                    {getMomTestQuestion(dim, assumption_statement)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onToggleTested(id)}
                    className={`flex-1 py-1.5 text-[9px] font-mono rounded border transition-colors cursor-pointer ${
                      isTested
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                  >
                    {isTested ? "MARK_UNTESTED" : "MARK_TESTED ✓"}
                  </button>
                  <button
                    onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-[9px] font-mono text-white/40 hover:text-white/70 border border-white/10 rounded transition-colors cursor-pointer"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-between items-center mt-1">
              <button
                onClick={() => setExpanded(true)}
                className="text-white/25 text-[10px] font-mono hover:text-white/50 cursor-pointer transition-colors"
              >
                Expand Analysis →
              </button>
              <button
                onClick={() => onToggleTested(id)}
                className="text-white/25 hover:text-emerald-400 text-[10px] font-mono cursor-pointer transition-colors"
              >
                {isTested ? "Mark Untested" : "Quick Validated ✓"}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
