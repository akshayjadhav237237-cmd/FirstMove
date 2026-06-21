import React, { useState } from "react";
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
    <div className="w-full h-full overflow-y-auto bg-[#080C14] flex flex-col items-center">
      <div className="max-w-2xl w-full px-6 mx-auto flex flex-col items-center text-center my-auto py-8">
        
        {/* TOP Logo row */}
        <div className="flex items-center gap-2 mb-8 text-sm font-semibold select-none">
          <div className="px-2 py-1 bg-[#6366F1] text-white rounded-lg font-bold text-xs uppercase tracking-tight">
            FM
          </div>
          <span className="text-[#F1F5F9] font-bold">FirstMove</span>
          <span className="text-[#475569]">|</span>
          <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[#94A3B8]">
            Multi-Agent
          </span>
        </div>

        {/* HEADLINE */}
        <div className="mb-4 tracking-tight leading-none text-left w-full select-none">
          <div className="text-4xl sm:text-5xl font-extrabold text-[#F1F5F9] leading-tight">
            Turn your rough idea
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#6366F1] leading-tight mt-1">
            into a battle-tested plan.
          </div>
        </div>

        {/* SUBTEXT */}
        <p className="text-[#94A3B8] text-sm sm:text-base max-w-xl text-left w-full mb-6 leading-relaxed">
          Three specialized AI agents debate your idea in parallel. You get the plan, the risks, and the one thing to do first.
        </p>

        {isLoading ? (
          <div className="w-full bg-[#0D1220] border border-white/[0.07] rounded-3xl p-8 flex flex-col gap-6 text-left">
            <p className="text-[#94A3B8] text-xs font-mono uppercase tracking-widest animate-pulse">
              INITIALIZING_MULTI_AGENT_SIMULATOR...
            </p>
            <QuestionSkeleton />
          </div>
        ) : (
          <div className="w-full flex flex-col items-start">
            {/* TEXTAREA */}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup concept or idea in a few sentences..."
              className="w-full bg-[#0D1220] border border-white/10 rounded-[20px] p-5 min-h-[120px] text-sm sm:text-base text-white placeholder-[#475569] leading-relaxed outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/15 transition-all duration-300 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit();
                }
              }}
            />

            {/* CHIPS */}
            <div className="flex flex-wrap gap-2 mb-4 justify-start w-full">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(chip)}
                  className="bg-transparent border border-white/10 text-[#475569] hover:border-[#6366F1]/50 hover:text-[#94A3B8] rounded-full px-4 py-1.5 text-sm transition-all duration-200 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {state.error && (
              <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-xs font-mono mb-4 text-left">
                SYSTEM_ERROR: {state.error}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-base font-semibold rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            >
              Analyze My Idea →
            </button>
          </div>
        )}

        {/* BOTTOM indicators */}
        {!isLoading && (
          <div className="mt-10 flex items-center gap-6 text-xs sm:text-sm font-semibold select-none">
            <div className="flex items-center gap-2 text-[#475569]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
              <span>Lead Strategist</span>
            </div>
            <div className="flex items-center gap-2 text-[#475569]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              <span>Risk Analyst</span>
            </div>
            <div className="flex items-center gap-2 text-[#475569]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span>Devil's Advocate</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
