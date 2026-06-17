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
    cls: "text-black bg-[#C7D2FE] border-2 border-black shadow-[1px_1px_0px_#000]",
  },
  VIABILITY: {
    label: "VIABILITY",
    cls: "text-black bg-[#A7F3D0] border-2 border-black shadow-[1px_1px_0px_#000]",
  },
  FEASIBILITY: {
    label: "FEASIBILITY",
    cls: "text-black bg-[#FDE68A] border-2 border-black shadow-[1px_1px_0px_#000]",
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
      className={`brutal-panel mb-3 overflow-hidden transition-all duration-150 ${
        isTested 
          ? "border-l-4 border-l-emerald-500 opacity-45" 
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b-2 border-black">
        <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded ${dvf.cls}`}>
          {dvf.label}
        </span>
        <span className="text-black/50 text-xs font-mono font-bold">
          CONFIDENCE_SCORE: {confidence_score}%
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <p className={`text-black/85 text-xs leading-relaxed font-semibold ${isTested ? "line-through" : ""}`}>
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
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="bg-[#F3F2EE] border-2 border-black rounded p-3.5 mt-2 space-y-3 shadow-[2px_2px_0px_#000]">
                {/* Contributing factors */}
                <div>
                  <span className="mono-label text-[8px] text-black/50 block mb-1.5 font-extrabold">
                    Risk Factors
                  </span>
                  <div className="space-y-1">
                    {(contributing_factors || []).map((factor, i) => (
                      <div key={i} className="text-black/70 text-[10px] font-mono font-semibold leading-relaxed">
                        {"▸ "}{factor}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mom Test method */}
                <div className="border-t border-black/10 pt-2.5">
                  <span className="mono-label text-[8px] text-black/50 block mb-1.5 font-extrabold">
                    Validation Method (Mom Test)
                  </span>
                  <p className="text-black/85 text-[10px] leading-relaxed font-medium">
                    {getMomTestQuestion(dim, assumption_statement)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onToggleTested(id)}
                    className={`flex-1 py-1.5 text-[9px] font-mono rounded border-2 border-black font-extrabold transition-all cursor-pointer shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] ${
                      isTested
                        ? "bg-[#FDE68A] text-black"
                        : "bg-[#A7F3D0] text-black"
                    }`}
                  >
                    {isTested ? "MARK_UNTESTED" : "MARK_TESTED ✓"}
                  </button>
                  <button
                    onClick={() => setExpanded(false)}
                    className="px-3 py-1.5 text-[9px] font-mono text-black/60 hover:text-black border-2 border-black rounded transition-all cursor-pointer shadow-[2px_2px_0px_#000]"
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
                className="text-black/40 text-[10px] font-mono hover:text-black hover:underline cursor-pointer transition-colors"
              >
                Expand Analysis →
              </button>
              <button
                onClick={() => onToggleTested(id)}
                className="text-black/45 hover:text-emerald-600 hover:underline text-[10px] font-mono cursor-pointer transition-colors font-semibold"
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
