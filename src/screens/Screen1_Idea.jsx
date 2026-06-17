import React, { useState } from "react";
import { motion } from "motion/react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";
import SystemHeader from "../components/SystemHeader";
import DashboardChassis from "../components/DashboardChassis";

const gentleSpring = { type: "spring", stiffness: 450, damping: 32, mass: 1 };

const CHIPS = [
  "An app that gives affordable 3D tours of rental flats in Pune",
  "A platform to help college students find internships faster",
  "A tool for solo founders to validate startup ideas quickly",
];

export default function Screen1_Idea({ isLoading }) {
  const { state, dispatch } = useSession();
  const [idea, setIdea] = useState(state.rawIdea || "");

  const handleSubmit = async () => {
    if (!idea.trim() || isLoading) return;
    const trimmed = idea.trim();
    dispatch({ type: "SUBMIT_IDEA", payload: trimmed });
    try {
      const res = await resilientFetch(
        "/api/clarify",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: trimmed }) },
        trimmed
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      dispatch({ type: "QUESTIONS_RECEIVED", payload: data.socratic_questions });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to generate questions." });
    }
  };

  return (
    <DashboardChassis activeTab="Dashboard">
      <SystemHeader simplified />

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono text-zinc-550 dark:text-[#62666d] uppercase tracking-widest bg-black/[0.02] dark:bg-white/[0.03] px-3 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.04] inline-block mb-3">
            INITIALIZE_IDEA_ANALYSIS
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
              className="inline-block w-1.5 h-3.5 bg-[#EAB308]/60 align-middle ml-1"
            />
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-[#f7f8f8] mb-2" style={{ letterSpacing: "-0.04em" }}>
            Welcome back, Founder
          </h1>
          <p className="text-zinc-600 dark:text-[#8a8f98] text-sm max-w-md mx-auto leading-relaxed">
            Specify a rough project idea. Three autonomous agents will collaborate to build a de-risked blueprint.
          </p>
        </div>

        {/* Input Card Chassis */}
        <div className="max-w-2xl w-full">
          <div
            className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 shadow-xl relative overflow-hidden"
            style={{
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 12px 24px -4px rgba(0,0,0,0.15)"
            }}
          >
            {isLoading ? (
              <div>
                <p className="text-[#EAB308] text-[9px] font-mono uppercase tracking-widest text-center mb-6 animate-pulse">
                  SUMMONING_AI_AGENTS...
                </p>
                <QuestionSkeleton />
              </div>
            ) : (
              <>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your startup concept or idea in a few sentences..."
                  className="w-full bg-[#f1f1f4] dark:bg-[#121318] border border-black/[0.06] dark:border-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.12] rounded-xl p-4 text-zinc-800 dark:text-[#d0d6e0] text-sm min-h-[140px] resize-none placeholder:text-zinc-400 dark:placeholder:text-[#62666d] leading-relaxed transition-all duration-150"
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                />

                {/* Starters chips */}
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIdea(chip)}
                      className="border border-black/[0.06] dark:border-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.12] bg-black/[0.01] dark:bg-white/[0.01] rounded-full text-zinc-500 dark:text-[#62666d] text-[11px] px-3.5 py-1.5 hover:text-zinc-900 dark:hover:text-[#8a8f98] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-200 text-left cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {state.error && (
                  <div className="bg-red-500/[0.06] border border-red-500/20 rounded-lg p-3 text-red-500 dark:text-red-400 text-xs font-mono mb-4">
                    ERROR: {state.error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!idea.trim()}
                  className="btn-accent w-full rounded-full py-3 px-6 text-black text-xs font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  Initiate Audit Sequence →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardChassis>
  );
}
