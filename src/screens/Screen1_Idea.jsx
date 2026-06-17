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

const CHIP_COLORS = ["bg-[#C7D2FE]", "bg-[#A7F3D0]", "bg-[#FDE68A]"];

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
        <div className="px-4 py-2 border-3 border-black bg-[#FDE68A] shadow-[3px_3px_0px_#000] rounded-lg inline-flex items-center gap-2">
          <span className="font-extrabold text-sm text-black tracking-tight">FM</span>
          <span className="text-black/60 text-xs font-mono uppercase tracking-wider font-semibold">· FirstMove</span>
        </div>
      </div>

      {/* Headline Console Section */}
      <div className="text-center max-w-3xl mb-8">
        <span className="mono-label text-[11px] text-black bg-[#A5B4FC] border-2 border-black px-3 py-1 rounded shadow-[2px_2px_0px_#000] inline-block mb-4">
          INITIALIZE::FIRSTMOVE_PROTOCOL
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
            className="inline-block w-1.5 h-3 bg-black align-middle ml-1"
          />
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black mb-3" style={{ letterSpacing: "-0.03em" }}>
          What is your startup concept?
        </h1>
        <p className="text-black/65 text-sm sm:text-base font-mono uppercase tracking-wide font-bold">
          Three autonomous agents will dissect and validate your core thesis.
        </p>
      </div>

      {/* Main Brutalist Box */}
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="brutal-panel p-8 flex flex-col gap-6">
            <p className="text-black text-[10px] font-mono uppercase tracking-widest text-center animate-pulse font-bold">
              SUMMONING_AI_AGENTS...
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            
            {/* The Textarea is the brutal panel */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept or idea in a few sentences..."
              className="w-full brutal-panel p-6 text-black text-base min-h-[180px] resize-none placeholder:text-black/30 leading-relaxed outline-none focus:bg-white focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[5px_5px_0px_#000] transition-all duration-150"
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
                  className={`border-2 border-black rounded-lg px-3.5 py-1.5 text-black font-semibold text-xs transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] ${CHIP_COLORS[i % 3]}`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {state.error && (
              <div className="bg-[#FCA5A5] border-2 border-black rounded-lg p-3.5 text-black text-xs font-mono font-bold shadow-[2px_2px_0px_#000] mb-2">
                ERROR: {state.error}
              </div>
            )}

            {/* Brutalist trigger button */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-brutal w-full py-4 rounded-lg text-black font-extrabold text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase transition-all duration-200"
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] border-2 border-black" />
            <span className="text-[9px] font-mono text-black/50 uppercase tracking-wider font-bold">Lead Strategist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCA5A5] border-2 border-black" />
            <span className="text-[9px] font-mono text-black/50 uppercase tracking-wider font-bold">Risk Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] border-2 border-black" />
            <span className="text-[9px] font-mono text-black/50 uppercase tracking-wider font-bold">Devil's Advocate</span>
          </div>
        </div>
      )}

    </div>
  );
}
