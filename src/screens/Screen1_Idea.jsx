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
      
      {/* Logo row */}
      <div className="mb-12">
        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/20 inline-flex items-center gap-2 backdrop-blur-md shadow-sm transition-all duration-300">
          <span className="font-extrabold text-sm text-white tracking-tight">FM</span>
          <span className="text-white/60 text-xs font-medium">· FirstMove</span>
        </div>
      </div>

      {/* 72px Headline Section */}
      <div className="text-center max-w-3xl mb-10">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
          What's your idea?
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-white/50 tracking-tight">
          Three agents will tear it apart.
        </p>
      </div>

      {/* Main Form container */}
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="glass-panel-hero p-8 flex flex-col gap-6">
            <p className="text-violet-400 text-[10px] font-mono uppercase tracking-widest text-center animate-pulse">
              SUMMONING_AI_AGENTS...
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            
            {/* The Textarea itself is the glass element */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept or idea in a few sentences..."
              className="w-full glass-panel-hero p-6 text-white text-base min-h-[180px] resize-none placeholder:text-white/20 leading-relaxed outline-none focus:border-violet-400/40 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit();
                }
              }}
            />

            {/* Chips */}
            <div className="flex flex-wrap gap-2 mt-2 mb-6">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(chip)}
                  className="glass-panel rounded-full px-4 py-2 text-white/40 hover:text-white/70 border-white/8 hover:border-white/20 text-xs sm:text-sm transition-all duration-300 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs font-mono mb-2">
                ERROR: {state.error}
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-primary-glow w-full py-4.5 rounded-[14px] text-white font-bold text-base tracking-tight disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase"
              style={{ letterSpacing: "-0.01em" }}
            >
              Initiate Audit Sequence →
            </button>
          </div>
        )}
      </div>

      {/* Bottom agent indicators */}
      {!isLoading && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Strategist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F87171]" />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Devil</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
