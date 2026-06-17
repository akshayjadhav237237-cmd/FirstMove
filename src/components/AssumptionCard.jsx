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

export default function AssumptionCard({ assumption, isTested, onToggleTested, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const { id, dimension, assumption_statement, confidence_assessment } = assumption;
  const { confidence_score, contributing_factors } = confidence_assessment || {};

  const dim = (dimension || "DESIRABILITY").toUpperCase();

  return (
    <div
      className={`terminal-panel mb-3 overflow-hidden transition-all duration-300 p-4 ${
        isTested ? "opacity-45" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#1b4d1b] mb-3">
        <span className="text-xs font-mono font-bold text-[#33ff33]">
          [ {dim} ]
        </span>
        <span className="text-xs font-mono text-[#33ff33]">
          CONFIDENCE: {confidence_score}%
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3">
        <p className={`text-xs leading-relaxed text-[#33ff33]/90 ${isTested ? "line-through" : ""}`}>
          {isTested ? "[x] " : "[ ] "} {assumption_statement}
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
              <div className="border border-[#1b4d1b] bg-[#050c05] p-3.5 mt-2 space-y-3">
                {/* Contributing factors */}
                <div>
                  <span className="text-[10px] text-[#33ff33]/50 block mb-1.5 font-bold uppercase">
                    // Risk Factors
                  </span>
                  <div className="space-y-1">
                    {(contributing_factors || []).map((factor, i) => (
                      <div key={i} className="text-[10px] font-mono leading-relaxed text-[#33ff33]/70">
                        ▸ {factor}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mom Test method */}
                <div className="border-t border-[#1b4d1b] pt-2.5">
                  <span className="text-[10px] text-[#33ff33]/50 block mb-1.5 font-bold uppercase">
                    // Validation Method (Mom Test)
                  </span>
                  <p className="text-[10px] leading-relaxed text-[#33ff33]/70">
                    {getMomTestQuestion(dim, assumption_statement)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onToggleTested(id)}
                    className="btn-terminal flex-1 py-1 text-[10px] transition-colors cursor-pointer"
                  >
                    {isTested ? "[ MARK_UNTESTED ]" : "[ MARK_TESTED ]"}
                  </button>
                  <button
                    onClick={() => setExpanded(false)}
                    className="btn-terminal px-3 py-1 text-[10px] transition-colors cursor-pointer"
                  >
                    [ CLOSE ]
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-between items-center mt-1">
              <button
                onClick={() => setExpanded(true)}
                className="text-[#33ff33]/60 text-[10px] font-mono hover:text-[#33ff33] cursor-pointer transition-colors"
              >
                &gt;&gt; EXPAND_ANALYSIS
              </button>
              <button
                onClick={() => onToggleTested(id)}
                className="text-[#33ff33]/60 hover:text-[#33ff33] text-[10px] font-mono cursor-pointer transition-colors font-semibold"
              >
                {isTested ? "[ Mark Untested ]" : "[ Quick Validated ]"}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
