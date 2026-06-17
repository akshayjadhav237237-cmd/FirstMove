import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";
import AgentCard from "../components/AgentCard";

const AGENT_KEYS = ["strategist", "risk_analyst", "devils_advocate"];

const AGENT_PREVIEWS = {
  strategist: {
    name: "Lead Strategist",
    color: "#818CF8",
    role: "Opportunity Analysis",
    description: "Will map the opportunity space and build the strongest case for your idea.",
  },
  risk_analyst: {
    name: "Risk Analyst",
    color: "#F87171",
    role: "Threat Assessment",
    description: "Will surface every assumption that can kill your idea before you build it.",
  },
  devils_advocate: {
    name: "Devil's Advocate",
    color: "#FB923C",
    role: "Challenge Assessment",
    description: "Will challenge your core premise and find the weakest point in your logic.",
  },
};

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
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to build plan. Please try again." });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="w-[45%] flex flex-col border-r border-white/6 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-white/6 flex-shrink-0">
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="text-muted text-sm hover:text-white cursor-pointer transition mb-6 block"
          >
            ← Start over
          </button>
          <span className="bg-accent/10 text-accent text-xs rounded-full px-3 py-1 inline-block mb-4 font-semibold">
            Step 2 of 3
          </span>
          <h1 className="text-white text-2xl font-semibold mb-2">A few quick questions</h1>
          <p className="text-secondary text-sm">Your answers determine what the agents debate.</p>
        </div>

        {/* Questions */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <>
              <p className="text-secondary text-sm animate-pulse mb-6 font-medium">
                Agents are debating...
              </p>
              <QuestionSkeleton />
            </>
          ) : (
            <div className="space-y-4">
              {state.socraticQuestions.map((q) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-card border border-white/8 rounded-xl p-5"
                >
                  <p className="text-muted text-xs uppercase tracking-widest mb-2 font-medium">
                    {q.target_variable}
                  </p>
                  <h2 className="text-white text-base font-medium mb-1 leading-snug">
                    {q.question_text}
                  </h2>
                  <p className="text-muted text-xs italic mb-4">{q.contextual_rationale}</p>
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Your answer..."
                    className="bg-input-bg border border-white/8 rounded-lg p-4 text-white text-sm w-full min-h-[90px] resize-none placeholder:text-muted/50 transition-all duration-150"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/6 flex-shrink-0">
          {state.error && (
            <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3 text-red-400 text-sm mb-4">
              {state.error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isLoading}
            className="w-full bg-accent hover:bg-accent-hover rounded-xl py-4 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(108,99,255,0.2)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Agents are debating...
              </>
            ) : (
              "Launch Agent Debate →"
            )}
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-[55%] overflow-y-auto p-8">
        <h2 className="text-white font-semibold text-base mb-2">What happens next</h2>
        <p className="text-muted text-sm mb-8">
          Once you answer, three agents analyze your idea simultaneously.
        </p>

        {isLoading ? (
          /* Active agent cards with typewriter simulation */
          <div className="space-y-4">
            {AGENT_KEYS.map((key, i) => (
              <AgentCard
                key={key}
                agentKey={key}
                data={null}
                isLoading={true}
                delay={i * 0.15}
              />
            ))}
          </div>
        ) : (
          /* Preview cards */
          <div className="flex flex-col gap-4">
            {AGENT_KEYS.map((key, i) => {
              const cfg = AGENT_PREVIEWS[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-white/8 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                    <span className="text-white text-sm font-semibold">{cfg.name}</span>
                    <span className="ml-auto text-xs text-muted bg-white/5 px-2 py-0.5 rounded-full">
                      {cfg.role}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{cfg.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: cfg.color + "66" }} />
                    <span className="text-muted text-xs">Waiting for your answers...</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
