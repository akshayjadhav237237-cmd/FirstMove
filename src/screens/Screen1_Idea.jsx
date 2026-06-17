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
    <div className="scrollable-screen w-full flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative font-mono">
      
      {/* Logo Row */}
      <div className="mb-10">
        <div className="px-4 py-1.5 bg-[#0a1a0a] border border-[#1b4d1b] inline-flex items-center gap-2 shadow-[0_0_6px_rgba(51,255,51,0.15)]">
          <span className="font-extrabold text-xs text-[#33ff33]">FM</span>
          <span className="text-[#33ff33]/50 text-[10px] uppercase tracking-wider font-semibold">// FIRSTMOVE_OS_v1.0</span>
        </div>
      </div>

      {/* Headline Console Section */}
      <div className="text-center max-w-3xl mb-8">
        <span className="text-[11px] text-[#33ff33]/60 block mb-3 font-semibold uppercase">
          LOAD_PROTOCOL::STARTUP_THESIS_AUDIT
          <span className="cursor-blink inline-block w-2 h-3.5 bg-[#33ff33] align-middle ml-1" />
        </span>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#33ff33] mb-4 uppercase">
          Enter Concept Thesis
        </h1>
        <p className="text-[#33ff33]/60 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          SYSTEM_ALERT: Three autonomous simulation agent processes are ready to analyze core business assumptions.
        </p>
      </div>

      {/* Main Box */}
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="terminal-panel p-8 flex flex-col gap-6">
            <p className="text-[#33ff33] text-xs font-mono uppercase tracking-widest text-center animate-pulse">
              &gt;&gt; STAGING_AI_AGENT_PROCESSSORS... [RUNNING]
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            
            {/* Monospace terminal input area */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your concept in detail here... C:\FIRSTMOVE> _"
              className="w-full terminal-panel p-6 text-[#33ff33] text-sm min-h-[180px] resize-none placeholder:text-[#33ff33]/20 leading-relaxed outline-none focus:border-[#33ff33] focus:shadow-[0_0_12px_rgba(51,255,51,0.2)] transition-all duration-300 bg-[#050905]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit();
                }
              }}
            />

            {/* CLI Suggestion flags */}
            <div className="flex flex-wrap gap-2 mt-1 mb-6 justify-center">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(chip)}
                  className="border border-[#1b4d1b] bg-[#050c05] px-3.5 py-1 text-[#33ff33]/50 hover:text-[#33ff33] hover:border-[#33ff33] text-[10px] transition-all duration-200 cursor-pointer"
                >
                  --param-"{chip.toLowerCase().split(' ').slice(0, 3).join('-')}"
                </button>
              ))}
            </div>

            {state.error && (
              <div className="bg-red-950/20 border border-red-500/30 rounded-none p-3.5 text-red-500 text-xs font-mono">
                [SYSTEM_ERROR]: {state.error}
              </div>
            )}

            {/* Terminal prompt execute button */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-terminal w-full py-4 text-sm font-extrabold uppercase disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
            >
              [ RUN AUDIT SIMULATION PROTOCOL ]
            </button>
          </div>
        )}
      </div>

      {/* Bottom agent indicators */}
      {!isLoading && (
        <div className="mt-14 flex items-center gap-6 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-[#33ff33]/40">[</span>
            <span className="text-[#33ff33] font-bold">LS</span>
            <span className="text-[#33ff33]/40">]</span>
            <span className="text-[#33ff33]/50 uppercase">Lead Strategist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#33ff33]/40">[</span>
            <span className="text-[#33ff33] font-bold">RA</span>
            <span className="text-[#33ff33]/40">]</span>
            <span className="text-[#33ff33]/50 uppercase">Risk Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#33ff33]/40">[</span>
            <span className="text-[#33ff33] font-bold">DA</span>
            <span className="text-[#33ff33]/40">]</span>
            <span className="text-[#33ff33]/50 uppercase">Devil's Advocate</span>
          </div>
        </div>
      )}

    </div>
  );
}
