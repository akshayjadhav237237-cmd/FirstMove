import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";
import AgentCard from "../components/AgentCard";
import SystemHeader from "../components/SystemHeader";

const smoothSpring = { type: "spring", stiffness: 450, damping: 32, mass: 1 };

const AGENT_KEYS = ["strategist", "risk_analyst", "devils_advocate"];

const AGENT_PREVIEWS = {
  strategist: {
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    color: "#818CF8",
    description: "Will map the opportunity space and build the strongest case for your idea.",
  },
  risk_analyst: {
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    color: "#F87171",
    description: "Will surface every assumption that can kill your idea before you build it.",
  },
  devils_advocate: {
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    color: "#FB923C",
    description: "Will challenge your core premise and find the weakest point in your logic.",
  },
};

export default function Screen2_Questions({ isLoading }) {
  const { state, dispatch } = useSession();
  const [answers, setAnswers] = useState(state.userAnswers || {});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div className="flex flex-col w-screen h-screen bg-canvas overflow-hidden">
      <SystemHeader />

      <div className={`flex flex-1 min-h-0 ${isMobile ? "flex-col overflow-y-auto" : ""}`}>
        {/* ── LEFT PANEL ── */}
        <div className={`${isMobile ? "w-full border-b" : "w-[45%] border-r"} flex flex-col border-white/[0.04]`}>
          {/* Panel header */}
          <div
            className="h-10 flex-shrink-0 flex items-center justify-between px-4 bg-white/[0.01] border-b border-white/[0.06]"
          >
            <span className="text-[10px] font-mono text-[#f7f8f8] font-semibold uppercase tracking-widest">
              CLARIFICATION_PROTOCOL
            </span>
            <span className="text-[9px] font-mono text-accent">02 / 03</span>
          </div>

          {/* Questions scrollable */}
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <>
                <p className="text-[#62666d] text-[9px] font-mono uppercase tracking-widest animate-pulse mb-5">
                  PROCESSING_AGENT_PIPELINE...
                </p>
                <QuestionSkeleton />
              </>
            ) : (
              <div className="space-y-4">
                {state.socraticQuestions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, ...smoothSpring }}
                    className="bg-surface border border-white/[0.04] hover:border-white/[0.12] rounded-lg p-5 transition-all duration-200"
                    style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(0,0,0,0.4)" }}
                  >
                    <p className="text-[9px] font-mono text-[#62666d] uppercase tracking-widest mb-2">
                      {q.target_variable}
                    </p>
                    <h2 className="text-[#d0d6e0] text-sm font-medium leading-snug mb-1">
                      {q.question_text}
                    </h2>
                    <p className="text-[#62666d] text-[10px] font-mono italic mb-4">
                      {q.contextual_rationale}
                    </p>
                    <textarea
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Your answer..."
                      className="bg-surface-2 border border-white/[0.04] hover:border-white/[0.12] rounded-lg p-3 text-[#d0d6e0] text-sm w-full min-h-[90px] resize-none placeholder:text-[#62666d] transition-all duration-150"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-5 border-t border-white/[0.06]">
            {state.error && (
              <div className="bg-red-500/[0.06] border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-mono mb-3">
                ERROR: {state.error}
              </div>
            )}
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => dispatch({ type: "RESET" })}
                className="text-[#62666d] text-[10px] font-mono hover:text-[#8a8f98] transition-colors cursor-pointer"
              >
                ← RESTART
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isLoading}
              className="btn-accent w-full rounded-lg py-3 px-6 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-mono text-xs">PIPELINE_RUNNING...</span>
                </>
              ) : (
                "LAUNCH_AGENT_PIPELINE →"
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={`${isMobile ? "w-full" : "w-[55%]"} flex flex-col bg-panel-r`}>
          {/* Panel header */}
          <div className="h-10 flex-shrink-0 flex items-center justify-between px-4 bg-white/[0.01] border-b border-white/[0.06]">
            <span className="text-[10px] font-mono text-[#f7f8f8] font-semibold uppercase tracking-widest">
              AGENT_MANIFEST
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62666d]" />
              <span className="text-[9px] font-mono text-[#62666d] uppercase">STANDBY</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <div className="space-y-1">
                {AGENT_KEYS.map((key, i) => (
                  <AgentCard key={key} agentKey={key} data={null} isLoading={true} delay={i * 0.12} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {AGENT_KEYS.map((key, i) => {
                  const cfg = AGENT_PREVIEWS[key];
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, ...smoothSpring }}
                      className="bg-surface border border-white/[0.04] hover:border-white/[0.12] rounded-lg overflow-hidden mb-3 transition-all duration-200"
                      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(0,0,0,0.4)" }}
                    >
                      <div className="h-10 flex items-center px-4 bg-white/[0.01] border-b border-white/[0.04]">
                        <span className="w-3 h-3 rounded-sm mr-2.5 flex-shrink-0" style={{ backgroundColor: cfg.color + "cc" }} />
                        <span className="text-xs font-semibold text-[#f7f8f8]">{cfg.name}</span>
                        <span className="w-px h-3 bg-white/10 mx-2" />
                        <span className="text-[9px] font-mono text-[#62666d] uppercase tracking-widest bg-white/[0.04] px-1.5 py-0.5 rounded">
                          {cfg.role}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[#8a8f98] text-xs leading-relaxed mb-3">{cfg.description}</p>
                        <p className="text-[9px] font-mono text-[#62666d]">AWAITING_INPUT_SIGNAL...</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
