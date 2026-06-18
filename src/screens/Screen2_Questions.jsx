import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const AGENTS = [
  {
    key: "strategist",
    initials: "LS",
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    bgCls: "bg-indigo-900/40 border-indigo-500/30 text-indigo-400",
    barBg: "bg-[#6366F1]",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    bgCls: "bg-rose-900/40 border-rose-500/30 text-rose-400",
    barBg: "bg-[#F43F5E]",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    bgCls: "bg-orange-900/40 border-orange-500/30 text-orange-400",
    barBg: "bg-[#F97316]",
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
    <div className="h-screen w-screen overflow-hidden bg-[#080C14] flex">
      <style>{`
        @keyframes slide-indicator {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide-indicator 3s linear infinite;
        }
      `}</style>

      <PanelGroup direction="horizontal" className="h-full w-full">
        
        {/* LEFT PANEL: 38% */}
        <Panel defaultSize={38} minSize={30} maxSize={48}>
          <div className="h-full flex flex-col bg-[#080C14] border-r border-white/[0.06] overflow-hidden relative">
            
            {/* Sticky top section */}
            <div className="px-8 pt-10 pb-6 flex-shrink-0 select-none relative">
              <button 
                onClick={() => dispatch({ type: "RESET" })} 
                className="text-[#475569] hover:text-[#6366F1] text-xs font-semibold mb-6 flex items-center gap-1 uppercase transition-colors"
              >
                &lt; Back
              </button>
              
              {/* Huge Background Number */}
              <div className="text-[80px] font-bold text-[#111827] leading-none mb-2 select-none pointer-events-none">
                02
              </div>
              
              <h1 className="text-xl font-bold text-[#F1F5F9] leading-tight">
                Answer these questions.
              </h1>
              <p className="text-[#475569] text-sm mt-1">
                Your answers shape the debate.
              </p>
            </div>

            {/* Questions list (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-8 pb-32">
              {isLoading ? (
                <div className="space-y-4">
                  <p className="text-[#94A3B8] text-xs font-mono uppercase tracking-widest animate-pulse">
                    GENERATING_DEBATE_BUFFERS...
                  </p>
                  <QuestionSkeleton />
                </div>
              ) : (
                state.socraticQuestions.map((q, i) => (
                  <div key={q.id} className="flex flex-col mb-8">
                    <div className="flex items-center mb-2">
                      <span className="bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        Q{i + 1}
                      </span>
                    </div>
                    <h2 className="text-[#F1F5F9] font-semibold text-sm leading-relaxed mb-1">
                      {q.question_text}
                    </h2>
                    <p className="text-[#475569] text-xs italic mb-3">
                      {q.contextual_rationale}
                    </p>
                    <textarea
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Type your response..."
                      className="w-full bg-[#111827] border border-white/[0.07] rounded-xl p-3 text-sm text-white min-h-[72px] resize-none outline-none focus:border-[#6366F1] transition-colors leading-relaxed"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Bottom sticky Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#080C14]/90 backdrop-blur-md px-8 py-6 border-t border-white/[0.06] z-10">
              {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-mono mb-4">
                  ERROR: {state.error}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isLoading}
                className="w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>LAUNCHING...</span>
                  </>
                ) : (
                  "Launch Debate →"
                )}
              </button>
            </div>

          </div>
        </Panel>

        {/* DRAG HANDLER */}
        <PanelResizeHandle className="w-[1px] bg-white/[0.06] hover:bg-[#6366F1]/50 hover:w-1 transition-all cursor-col-resize z-30" />

        {/* RIGHT PANEL: 62% */}
        <Panel defaultSize={62}>
          <div className="h-full bg-[#080C14] px-8 pt-10 overflow-y-auto pb-16">
            
            <div className="text-xs uppercase tracking-widest text-[#475569] mb-8 font-semibold select-none">
              Standing by
            </div>

            <div className="flex flex-col">
              {AGENTS.map((agent) => (
                <div key={agent.key} className="mb-10 flex items-start gap-4">
                  
                  {/* Circle avatar */}
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 select-none ${agent.bgCls}`}>
                    {agent.initials}
                  </div>

                  {/* Identity & Status */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#F1F5F9] font-semibold text-base uppercase tracking-tight leading-none">
                      {agent.name}
                    </h3>
                    <div className="text-[#475569] text-xs uppercase tracking-wider mt-1 mb-3 font-semibold">
                      {agent.role}
                    </div>

                    {/* Loader */}
                    {isLoading ? (
                      <div className="w-full bg-[#111827] rounded-full h-1 overflow-hidden relative mb-2">
                        <div className={`h-full animate-slide ${agent.barBg}`} style={{ width: "100%" }} />
                      </div>
                    ) : null}

                    {/* Status Text */}
                    <div className="text-xs font-mono text-[#475569]">
                      {isLoading ? "ANALYZING..." : "AWAITING YOUR INPUT"}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </Panel>

      </PanelGroup>
    </div>
  );
}
