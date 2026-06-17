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
    <div className="scrollable-screen w-full flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative font-sans">
      
      {/* Logo Row */}
      <div className="mb-10">
        <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 inline-flex items-center gap-2 backdrop-blur-md shadow-sm">
          <span className="font-extrabold text-xs text-[#00f0ff] tracking-tight">FM</span>
          <span className="text-white/50 text-[10px] font-mono uppercase tracking-wider font-semibold">· FirstMove</span>
        </div>
      </div>

      {/* Headline Console Section */}
      <div className="text-center max-w-3xl mb-8">
        <span className="mono-label text-[#ff007f] block mb-3 font-semibold uppercase">
          INITIALIZE::FIRSTMOVE_PROTOCOL
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
            className="inline-block w-1.5 h-3 bg-[#00f0ff] align-middle ml-1"
          />
        </span>
        <h1 className="heading-display font-semibold text-[#f7f8f8] mb-3 uppercase">
          What is your startup concept?
        </h1>
        <p className="text-[#d0d6e0] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Three autonomous agents will dissect and validate your core thesis.
        </p>
      </div>

      {/* Main Glass Box */}
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="synthwave-panel p-8 flex flex-col gap-6">
            <p className="text-[#00f0ff] text-[10px] font-mono uppercase tracking-widest text-center animate-pulse">
              SUMMONING_AI_AGENTS...
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            
            {/* The Textarea is the glass panel */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept or idea in a few sentences..."
              className="w-full synthwave-panel p-6 text-[#f7f8f8] text-sm sm:text-base min-h-[180px] resize-none placeholder:text-white/15 leading-relaxed outline-none focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.25)] bg-[#0d021a]/40 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit();
                }
              }}
            />

            {/* Starter Suggestion Chips */}
            <div className="flex flex-wrap gap-2 mt-1 mb-6 justify-center">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(chip)}
                  className="border border-[#00f0ff]/20 bg-[#0d021a]/50 text-[#00f0ff]/70 hover:text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] rounded-lg px-4 py-1.5 text-xs transition-all duration-300 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-xs font-mono">
                ERROR: {state.error}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-synthwave w-full py-4 uppercase font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
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
            <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
            <span className="mono-label uppercase font-semibold">Lead Strategist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F87171]" />
            <span className="mono-label uppercase font-semibold">Risk Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
            <span className="mono-label uppercase font-semibold">Devil's Advocate</span>
          </div>
        </div>
      )}

    </div>
  );
}
