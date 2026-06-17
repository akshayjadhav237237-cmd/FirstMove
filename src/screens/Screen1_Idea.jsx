import React, { useState } from "react";
import { motion } from "motion/react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";
import SystemHeader from "../components/SystemHeader";

const gentleSpring = { type: "spring", stiffness: 200, damping: 20, restSpeed: 0.1 };

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
    <div className="flex flex-col w-screen h-screen bg-canvas overflow-hidden">
      <SystemHeader simplified />

      <div className="flex-1 overflow-auto">
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-16">
          {/* Pre-headline mono tag */}
          <div className="mb-4 text-center">
            <span className="text-[10px] font-mono text-[#62666d] uppercase tracking-widest">
              INITIALIZE_IDEA_ANALYSIS
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
                className="inline-block w-1.5 h-3.5 bg-accent/60 align-middle ml-1"
              />
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[#f7f8f8] text-5xl font-semibold text-center mb-3"
            style={{ letterSpacing: "-0.04em" }}
          >
            What's your idea?
          </h1>
          <p className="text-[#8a8f98] text-base text-center mb-12">
            Three agents will debate it. One plan comes out.
          </p>

          {/* Card */}
          <div className="max-w-2xl w-full">
            <div
              className="bg-surface border border-white/[0.06] rounded-xl p-6"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.03), 0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              {isLoading ? (
                <div>
                  <p className="text-[#62666d] text-[10px] font-mono uppercase tracking-widest text-center mb-6 animate-pulse">
                    ANALYZING_INPUT...
                  </p>
                  <QuestionSkeleton />
                </div>
              ) : (
                <>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your idea in a sentence or two..."
                    className="w-full bg-surface-2 border border-white/[0.06] rounded-lg p-4 text-[#d0d6e0] text-sm min-h-[140px] resize-none placeholder:text-[#62666d] leading-relaxed transition-all duration-150"
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                  />

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {CHIPS.map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIdea(chip)}
                        className="border border-white/[0.08] rounded-full text-[#62666d] text-xs px-3 py-1.5 hover:border-white/[0.14] hover:text-[#8a8f98] hover:bg-white/[0.02] transition-all duration-200 text-left cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {state.error && (
                    <div className="bg-red-500/[0.06] border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-mono mb-4">
                      ERROR: {state.error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!idea.trim()}
                    className="btn-accent w-full rounded-lg py-3 px-6 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sharpen My Idea →
                  </button>
                </>
              )}
            </div>

            <p className="mt-8 text-center text-[9px] font-mono text-[#62666d] uppercase tracking-widest">
              STRATEGIST · RISK_ANALYST · DEVILS_ADVOCATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
