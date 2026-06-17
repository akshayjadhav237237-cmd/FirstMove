import React from "react";
import { useSession } from "../context/SessionContext";
import AssumptionCard from "./AssumptionCard";

export default function Screen3_Blueprint() {
  const { state, dispatch } = useSession();
  const { finalPlan } = state;

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  if (!finalPlan) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="text-secondary">No plan data available. Please start over.</p>
        <button
          onClick={handleReset}
          className="mt-4 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 select-none min-h-screen flex flex-col">
      {/* TOP ROW */}
      <div className="flex justify-between items-center mb-8">
        <span className="bg-accent/10 text-accent text-xs rounded-full px-3 py-1 font-semibold">
          Your FirstMove Plan
        </span>
        <button
          onClick={handleReset}
          className="text-secondary text-sm hover:text-white transition cursor-pointer font-medium"
        >
          Start over →
        </button>
      </div>

      {/* SECTION 1: SHARPENED IDEA */}
      <div className="bg-card border border-white/8 rounded-xl p-5 mb-6 shadow-md">
        <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
          <span>💡</span> Your Idea, Sharpened
        </h2>
        <p className="text-secondary text-sm leading-relaxed font-normal">
          {finalPlan.sharpened_problem_statement}
        </p>
      </div>

      {/* SECTION 2: ASSUMPTIONS MATRIX */}
      <div className="mb-6">
        <h2 className="text-white font-semibold text-sm mb-1 flex items-center gap-1.5">
          <span>⚠️</span> Load-Bearing Assumptions
        </h2>
        <p className="text-muted text-xs mb-4">
          Test the red ones first — they're what can kill your idea.
        </p>
        <div className="space-y-3">
          {finalPlan.assumptions_matrix &&
            finalPlan.assumptions_matrix.map((asm) => (
              <AssumptionCard key={asm.id} assumption={asm} />
            ))}
        </div>
      </div>

      {/* SECTION 3: ROADMAP */}
      <div className="mb-6">
        <h2 className="text-white font-semibold text-sm mt-8 mb-1 flex items-center gap-1.5">
          <span>🗺️</span> De-Risked Roadmap
        </h2>
        <p className="text-muted text-xs mb-5">
          Sequenced so you test the riskiest assumption first.
        </p>
        <div className="space-y-5">
          {finalPlan.prioritized_roadmap &&
            finalPlan.prioritized_roadmap.map((step) => (
              <div key={step.sequence_number} className="flex items-start">
                {/* Step Circle */}
                <div className="shrink-0 w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center mr-3 mt-0.5">
                  {step.sequence_number}
                </div>
                {/* Content */}
                <div className="flex flex-col">
                  <p className="text-white text-sm font-medium mb-1 leading-snug">
                    {step.mitigation_action}
                  </p>
                  <p className="text-muted text-xs mb-2">
                    ✓ Success when: {step.test_metrics}
                  </p>
                  {/* Assumption Chips */}
                  <div className="flex gap-1 flex-wrap mt-0.5">
                    {step.target_assumptions &&
                      step.target_assumptions.map((taId) => (
                        <span
                          key={taId}
                          className="bg-accent/10 text-accent text-[10px] font-semibold rounded-full px-2 py-0.5"
                        >
                          {taId}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* SECTION 4: FIRST MOVE */}
      <div className="border-2 border-accent/40 bg-accent/5 rounded-xl p-5 mt-8 shadow-lg">
        <h2 className="text-accent text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <span>🎯</span> Your FirstMove
        </h2>
        <p className="text-white text-base font-semibold mb-2 leading-snug">
          {finalPlan.immediate_next_step?.action_item}
        </p>
        <p className="text-secondary text-sm mb-4 leading-normal">
          What this proves: {finalPlan.immediate_next_step?.objective}
        </p>
        {/* Divider */}
        <div className="border-t border-white/8 pt-4">
          <p className="text-muted text-xs italic leading-relaxed">
            Whether this idea is worth pursuing is entirely your call — FirstMove surfaces what
            to test. You decide whether to commit.
          </p>
        </div>
      </div>
    </div>
  );
}
