import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";

const AGENTS = [
  {
    key: "strategist",
    initials: "LS",
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    gradient: "linear-gradient(135deg, #4F46E5, #818CF8)",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    gradient: "linear-gradient(135deg, #DC2626, #F87171)",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    gradient: "linear-gradient(135deg, #EA580C, #FB923C)",
  },
];

export default function Screen2_Questions({ isLoading }) {
  const { state, dispatch } = useSession();
  const [answers, setAnswers] = useState(state.userAnswers || {});

  const allAnswered =
    state.socraticQuestions.length > 0 &&
    state.socraticQuestions.every((q) => (answers[q.id] || "").trim().length > 0);

  const handleSubmit = async () => {
    if (!allAnswered || isLoading) return;
    const qa = state.socraticQuestions.map((q) => ({
      question_text: q.question_text,
      answer: answers[q.id] || "",
    }));
    dispatch({ type: "SUBMIT_ANSWERS", payload: answers });
    try {
      const res = await resilientFetch(
        "/api/analyze",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: state.rawIdea, qa }) },
        state.rawIdea
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      dispatch({ type: "ANALYSIS_COMPLETE", payload: { debate: data.debate, blueprint: data.blueprint } });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to build plan." });
    }
  };

  return (
    <div className="scrollable-screen w-full flex-1 flex flex-col lg:flex-row min-h-screen relative p-1 pb-4">
      
      {/* ── LEFT PANEL: Socratic Questions (44% width) ── */}
      <div className="w-full lg:w-[44%] flex flex-col cyber-panel p-8 m-4 lg:my-4 lg:mr-2 lg:ml-4 overflow-y-auto max-h-[calc(100vh-32px)]">
        
        {/* Step Pill */}
        <div className="self-start inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs text-violet-300 font-mono tracking-wider mb-6">
          Step 2 of 3
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1" style={{ letterSpacing: "-0.02em" }}>
          A few questions
        </h1>
        <p className="text-white/40 text-sm mb-8 tracking-tight font-mono uppercase text-[10px]">
          Provide parameters for simulation nodes.
        </p>

        {/* Question blocks */}
        <div className="flex-1 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-[#6366F1] text-[10px] font-mono uppercase tracking-widest animate-pulse">
                PROCESSING_AGENT_PIPELINE...
              </p>
              <QuestionSkeleton />
            </div>
          ) : (
            state.socraticQuestions.map((q, i) => (
              <div key={q.id} className="flex flex-col">
                <span className="mono-label text-[9px] text-white/30 mb-2 block font-semibold">
                  {q.target_variable || `VARIABLE_0${i + 1}`}
                </span>
                <h2 className="text-white text-sm font-semibold mb-1 leading-snug">
                  {q.question_text}
                </h2>
                <p className="text-white/30 text-xs italic mb-3">
                  {q.contextual_rationale}
                </p>
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Type your response..."
                  className="w-full bg-[#080710] border border-white/5 rounded-xl p-3.5 text-white text-sm min-h-[80px] resize-none placeholder:text-white/15 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-[#6366F1]/20 transition-all duration-200"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer controls & Submit */}
        <div className="pt-6 border-t border-white/5 mt-6 flex flex-col gap-4">
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-mono">
              ERROR: {state.error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="text-white/30 hover:text-white/70 text-[10px] font-mono tracking-wider transition-colors cursor-pointer uppercase"
            >
              ← Restart
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isLoading}
            className="btn-cyber w-full py-4 rounded-xl text-white font-bold text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 uppercase transition-all duration-200"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="font-mono text-xs tracking-wider">PIPELINE_RUNNING...</span>
              </>
            ) : (
              "Launch Agent Pipeline →"
            )}
          </button>
        </div>

      </div>

      {/* ── RIGHT PANEL: Agent Previews (56% width) ── */}
      <div className="w-full lg:w-[56%] flex flex-col m-4 lg:my-4 lg:ml-2 lg:mr-4 max-h-[calc(100vh-32px)]">
        
        {/* Section Heading */}
        <div className="mt-8 mb-4 pl-2">
          <span className="mono-label text-xs tracking-widest text-white/40">
            Agents standing by
          </span>
        </div>

        {/* 3 Previews */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {AGENTS.map((agent) => (
            <div key={agent.key} className="cyber-panel p-5 flex items-center gap-4">
              
              {/* Gradient avatar */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 select-none shadow-inner"
                style={{ background: agent.gradient }}
              >
                <span className="font-bold text-white text-base tracking-tight">
                  {agent.initials}
                </span>
              </div>

              {/* Identity & Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {agent.name}
                  </h3>
                  <span className="mono-label text-[9px] text-white/20 tracking-wider">
                    {agent.role}
                  </span>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    {isLoading ? (
                      <motion.div 
                        className="h-full bg-indigo-400"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ width: "35%" }}
                      />
                    ) : (
                      <div className="h-full bg-white/5 w-[5%]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-indigo-400 led-cyan animate-pulse" : "bg-emerald-400 led-green animate-pulse"}`} />
                    <span className="text-white/20 text-[9px] font-mono uppercase tracking-wider">
                      {isLoading ? "ANALYZING_VARIABLES..." : "AWAITING INPUT"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
