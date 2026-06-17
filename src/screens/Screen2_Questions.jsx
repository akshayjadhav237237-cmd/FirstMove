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
    bgColor: "bg-[#A5B4FC]",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    bgColor: "bg-[#FCA5A5]",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    bgColor: "bg-[#FDBA74]",
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
      <div className="w-full lg:w-[44%] flex flex-col brutal-panel p-8 m-4 lg:my-4 lg:mr-2 lg:ml-4 overflow-y-auto max-h-[calc(100vh-32px)]">
        
        {/* Step Pill */}
        <div className="self-start inline-flex items-center rounded-lg bg-[#A5B4FC] border-2 border-black px-3 py-1 text-xs text-black font-mono tracking-wider font-bold shadow-[2px_2px_0px_#000] mb-6">
          Step 2 of 3
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1" style={{ letterSpacing: "-0.03em" }}>
          A few questions
        </h1>
        <p className="text-black/60 text-xs mb-8 font-mono uppercase tracking-wide font-bold">
          Provide parameters for simulation nodes.
        </p>

        {/* Question blocks */}
        <div className="flex-1 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-black text-[10px] font-mono uppercase tracking-widest animate-pulse font-bold">
                PROCESSING_AGENT_PIPELINE...
              </p>
              <QuestionSkeleton />
            </div>
          ) : (
            state.socraticQuestions.map((q, i) => (
              <div key={q.id} className="flex flex-col">
                <span className="mono-label text-[9px] text-black/40 mb-2 block font-extrabold">
                  {q.target_variable || `VARIABLE_0${i + 1}`}
                </span>
                <h2 className="text-black text-sm font-bold mb-1 leading-snug">
                  {q.question_text}
                </h2>
                <p className="text-black/50 text-xs italic mb-3">
                  {q.contextual_rationale}
                </p>
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Type your response..."
                  className="w-full bg-[#F3F2EE] border-2 border-black rounded-lg p-3 text-black text-sm min-h-[80px] resize-none placeholder:text-black/30 outline-none focus:bg-white transition-all duration-150"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer controls & Submit */}
        <div className="pt-6 border-t border-black/10 mt-6 flex flex-col gap-4">
          {state.error && (
            <div className="bg-[#FCA5A5] border-2 border-black rounded-lg p-3 text-black text-xs font-mono font-bold shadow-[2px_2px_0px_#000]">
              ERROR: {state.error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="text-black/45 hover:text-black text-[10px] font-mono tracking-wider font-bold transition-colors cursor-pointer uppercase"
            >
              ← Restart
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isLoading}
            className="btn-brutal w-full py-4 rounded-lg text-black font-extrabold text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 uppercase transition-all duration-150"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin" />
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
          <span className="mono-label text-xs tracking-widest text-black/50 font-bold">
            Agents standing by
          </span>
        </div>

        {/* 3 Previews */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {AGENTS.map((agent) => (
            <div key={agent.key} className="brutal-panel p-5 flex items-center gap-4">
              
              {/* Gradient avatar */}
              <div 
                className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0 select-none shadow-[2px_2px_0px_#000] ${agent.bgColor}`}
              >
                <span className="font-extrabold text-black text-base tracking-tight">
                  {agent.initials}
                </span>
              </div>

              {/* Identity & Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-black font-bold text-sm truncate">
                    {agent.name}
                  </h3>
                  <span className="mono-label text-[9px] text-black/50 tracking-wider">
                    {agent.role}
                  </span>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="w-full bg-[#F3F2EE] border-2 border-black rounded-lg h-3 overflow-hidden p-0.5">
                    {isLoading ? (
                      <motion.div 
                        className="h-full bg-[#A5B4FC] rounded"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ width: "30%" }}
                      />
                    ) : (
                      <div className="h-full bg-black/10 w-[5%] rounded" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-2 h-2 rounded-full border border-black ${isLoading ? "bg-[#A5B4FC] animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                    <span className="text-black/40 text-[9px] font-mono uppercase tracking-wider font-bold">
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
