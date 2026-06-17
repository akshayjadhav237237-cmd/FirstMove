import React, { useState } from "react";
import { motion } from "motion/react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";

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
    <div className="scrollable-screen w-full flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative">
      
      {/* Logo Row */}
      <div className="mb-10">
        <div className="px-4 py-1.5 rounded-full bg-[#0d0e15] border border-white/5 inline-flex items-center gap-2">
          <span className="font-extrabold text-xs text-white tracking-tight">FM</span>
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">· FirstMove</span>
        </div>
      </div>

      {/* Headline Console Section */}
      <div className="text-center max-w-3xl mb-8">
        <span className="mono-label text-[10px] text-violet-400 block mb-3 font-semibold">
          INITIALIZE::FIRSTMOVE_PROTOCOL
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
            className="inline-block w-1.5 h-3 bg-violet-400 align-middle ml-1"
          />
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          What is your startup concept?
        </h1>
        <p className="text-white/40 text-sm sm:text-base font-mono uppercase tracking-wide">
          Three autonomous agents will dissect and validate your core thesis.
        </p>
      </div>

      {/* Main Console Box */}
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="cyber-panel p-8 flex flex-col gap-6">
            <p className="text-violet-400 text-[10px] font-mono uppercase tracking-widest text-center animate-pulse">
              SUMMONING_AI_AGENTS...
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            
            {/* The Textarea is the cyber panel */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept or idea in a few sentences..."
              className="w-full cyber-panel p-6 text-white text-base min-h-[180px] resize-none placeholder:text-white/15 leading-relaxed outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-[#6366F1]/25 transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit();
                }
              }}
            />

            {/* Starter Suggestion Chips */}
            <div className="flex flex-wrap gap-2 mt-1 mb-6">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(chip)}
                  className="cyber-panel rounded-full px-3.5 py-1.5 text-white/40 hover:text-white/75 border-white/5 hover:border-white/10 text-xs transition-all duration-200 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-mono mb-2">
                ERROR: {state.error}
              </div>
            )}

            {/* Gradient button with cyan/indigo accent styles */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-cyber w-full py-4 rounded-xl text-white font-bold text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase transition-all duration-200"
            >
              Initiate Audit Sequence →
            </button>
          </div>
        )}
      </div>

      {/* Bottom agent indicators */}
      {!isLoading && (
        <div className="mt-14 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Lead Strategist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F87171]" />
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Risk Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C]" />
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Devil's Advocate</span>
          </div>
        </div>
      )}

    </div>
  );
}
