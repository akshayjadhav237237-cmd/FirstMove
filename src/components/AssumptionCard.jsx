import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfidenceRing from "./ConfidenceRing";

const smoothSpring = { type: "spring", stiffness: 450, damping: 32, mass: 1 };

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
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(0,0,0,0.4)",
  };

  if (view === "tested") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, ...smoothSpring }}
        className="bg-surface border border-white/[0.04] hover:border-white/[0.12] border-l-[3px] border-l-emerald-500/60 rounded-lg mb-3 overflow-hidden transition-all duration-200"
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
      className="bg-surface border border-white/[0.04] hover:border-white/[0.12] rounded-lg mb-3 overflow-hidden transition-all duration-200"
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
                <p className="text-[9px] font-mono text-[#62666d] mb-1">{`> HOW_TO_TEST:`}</p>
                <p className="text-[#d0d6e0] text-xs leading-relaxed">
                  {getMomTestQuestion(dim, assumption_statement)}
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
