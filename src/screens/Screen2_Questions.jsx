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
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
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
    <div className="scrollable-screen w-full flex-1 flex flex-col lg:flex-row min-h-screen relative p-1 pb-4 font-mono">
      
      {/* ── LEFT PANEL: Socratic Questions (44% width) ── */}
      <div className="w-full lg:w-[44%] flex flex-col terminal-panel p-8 m-4 lg:my-4 lg:mr-2 lg:ml-4 overflow-y-auto max-h-[calc(100vh-32px)] bg-[#050905]">
        
        {/* Step Badge */}
        <div className="self-start inline-flex items-center border border-[#1b4d1b] bg-[#050c05] px-3.5 py-1.5 text-xs text-[#33ff33]/70 font-mono tracking-wider mb-6">
          [ PARAM_CONFIG: STEP 2 OF 3 ]
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-[#33ff33] tracking-tight mb-2 uppercase">
          Required Parameters
        </h1>
        <p className="text-[#33ff33]/40 text-xs mb-8 uppercase tracking-wide font-semibold">
          // FILL VARIABLE BUFFER DATA FOR SIMULATION ENVIRONMENT
        </p>

        {/* Question blocks */}
        <div className="flex-1 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-[#33ff33] text-[10px] uppercase tracking-widest animate-pulse">
                &gt;&gt; RUNNING_PIPELINE_INIT... [PENDING]
              </p>
              <QuestionSkeleton />
            </div>
          ) : (
            state.socraticQuestions.map((q, i) => (
              <div key={q.id} className="flex flex-col">
                <span className="text-[10px] text-[#33ff33]/40 mb-2 block font-semibold">
                  // SYS_VAR_ID:: {q.target_variable || `VARIABLE_0${i + 1}`}
                </span>
                <h2 className="text-[#33ff33] text-sm font-semibold mb-1 leading-snug">
                  &gt; {q.question_text}
                </h2>
                <p className="text-[#33ff33]/40 text-xs italic mb-3">
                  /* Context: {q.contextual_rationale} */
                </p>
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Enter argument payload..."
                  className="w-full bg-[#050705] border border-[#1b4d1b] rounded-none p-3.5 text-[#33ff33] text-sm min-h-[80px] resize-none placeholder:text-[#33ff33]/15 outline-none focus:border-[#33ff33] focus:shadow-[0_0_8px_rgba(51,255,51,0.15)] transition-all duration-200"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer controls & Submit */}
        <div className="pt-6 border-t border-[#1b4d1b] mt-6 flex flex-col gap-4">
          {state.error && (
            <div className="bg-red-950/20 border border-red-500/30 rounded-none p-3.5 text-red-500 text-xs font-mono">
              [FAIL_ALERT]: {state.error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="text-[#33ff33]/45 hover:text-[#33ff33] text-[10px] tracking-wider transition-colors cursor-pointer uppercase"
            >
              [ &lt;- REBOOT ]
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isLoading}
            className="btn-terminal w-full py-4 text-sm font-extrabold tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 uppercase transition-all duration-200"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#33ff33] border-t-transparent rounded-full animate-spin" />
                <span>PROCESSING_AGENT_NODES...</span>
              </>
            ) : (
              "[ START SIMULATION AUDIT Swarm ]"
            )}
          </button>
        </div>

      </div>

      {/* ── RIGHT PANEL: Agent Previews (56% width) ── */}
      <div className="w-full lg:w-[56%] flex flex-col m-4 lg:my-4 lg:ml-2 lg:mr-4 max-h-[calc(100vh-32px)]">
        
        {/* Section Heading */}
        <div className="mt-8 mb-4 pl-2">
          <span className="text-xs tracking-widest text-[#33ff33]/50 font-semibold uppercase">
            // SIMULATION_PROCESSORS_LIST
          </span>
        </div>

        {/* 3 Previews */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {AGENTS.map((agent) => (
            <div key={agent.key} className="terminal-panel p-5 flex items-center gap-4 bg-[#050905]">
              
              {/* Monospace icon box */}
              <div className="w-12 h-12 border border-[#1b4d1b] flex items-center justify-center flex-shrink-0 select-none bg-[#050c05] font-extrabold text-[#33ff33]">
                {agent.initials}
              </div>

              {/* Identity & Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 border-b border-[#1b4d1b]/40 pb-1.5">
                  <h3 className="text-[#33ff33] font-bold text-sm truncate uppercase">
                    {agent.name}
                  </h3>
                  <span className="text-[9px] text-[#33ff33]/40 tracking-wider">
                    {agent.role}
                  </span>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex flex-col gap-1.5">
                  {isLoading ? (
                    <div className="text-[10px] text-[#33ff33] font-mono leading-none tracking-wide animate-pulse">
                      [███████████░░░░░░░░] DEBATE_BUFFER_CALCULATING
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#33ff33]/30 font-mono leading-none tracking-wide">
                      [░░░░░░░░░░░░░░░░░░░░] PROCESS_STANDBY
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 bg-[#33ff33] ${isLoading ? "animate-ping" : "animate-pulse"}`} style={{ boxShadow: "0 0 6px #33ff33" }} />
                    <span className="text-[#33ff33]/40 text-[9px] uppercase tracking-wider font-semibold">
                      {isLoading ? "CALCULATING THESIS ASSUMPTION COEFFICIENTS..." : "AWAITING USER ARGUMENTS..."}
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
