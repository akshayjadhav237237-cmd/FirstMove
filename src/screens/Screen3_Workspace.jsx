import React from "react";
import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";
import AssumptionCard from "../components/AssumptionCard";
import AgentCard from "../components/AgentCard";
import ScenarioCard from "../components/ScenarioCard";

const AGENT_KEYS = ["strategist", "risk_analyst", "devils_advocate"];
const SCENARIO_KEYS = ["optimistic", "neutral", "pessimistic"];

export default function Screen3_Workspace() {
  const { state, dispatch } = useSession();
  const { debate, blueprint } = state;

  if (!blueprint || !debate) {
    return (
      <div className="h-screen flex items-center justify-center bg-base">
        <div className="text-center">
          <p className="text-secondary mb-4">No plan data found.</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-xl font-medium transition"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ══ LEFT PANEL ══ */}
      <div className="w-[42%] panel-scroll border-r border-white/6">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/6 flex justify-between items-center sticky top-0 bg-base z-10">
          <span className="bg-accent/10 text-accent text-xs rounded-full px-3 py-1 font-semibold">
            Your FirstMove Plan
          </span>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="text-muted text-sm hover:text-white cursor-pointer transition"
          >
            Start over →
          </button>
        </div>

        <div className="px-8 py-6">

          {/* ── Sharpened Idea ── */}
          <div className="bg-card border border-white/8 rounded-xl p-5 mb-8">
            <h2 className="text-white font-semibold text-sm mb-3">💡 Your Idea, Sharpened</h2>
            <p className="text-secondary text-sm leading-relaxed">
              {blueprint.sharpened_problem_statement}
            </p>
          </div>

          {/* ── Assumptions Matrix ── */}
          <h2 className="text-white font-semibold text-sm mb-1">⚠️ Load-Bearing Assumptions</h2>
          <p className="text-muted text-xs mb-5">Test the red ones first.</p>
          <div>
            {(blueprint.assumptions_matrix || []).map((asm, i) => (
              <AssumptionCard key={asm.id} assumption={asm} index={i} />
            ))}
          </div>

          {/* ── Roadmap ── */}
          <h2 className="text-white font-semibold text-sm mt-8 mb-1">🗺️ De-Risked Roadmap</h2>
          <p className="text-muted text-xs mb-6">Riskiest assumption tested first.</p>
          <div>
            {(blueprint.prioritized_roadmap || []).map((step) => (
              <div key={step.sequence_number} className="flex items-start mb-6">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent text-sm font-bold flex items-center justify-center shrink-0 mr-4 mt-0.5">
                  {step.sequence_number}
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">{step.mitigation_action}</p>
                  <p className="text-muted text-xs mb-2">✓ {step.test_metrics}</p>
                  <div className="flex gap-1 flex-wrap">
                    {(step.target_assumptions || []).map((id) => (
                      <span key={id} className="bg-accent/10 text-accent text-xs rounded-full px-2 py-0.5">
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── First Move ── */}
          <div className="border-2 border-accent/30 bg-accent/5 rounded-xl p-6 mt-8 mb-8">
            <h2 className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              🎯 Your FirstMove
            </h2>
            <p className="text-white text-base font-semibold mb-2 leading-snug">
              {blueprint.immediate_next_step?.action_item}
            </p>
            <p className="text-secondary text-sm mb-5">
              {blueprint.immediate_next_step?.objective}
            </p>
            <div className="border-t border-white/8 pt-5">
              <p className="text-muted text-xs italic">
                Whether this idea is worth pursuing is your call. FirstMove never decides that.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="w-[58%] panel-scroll p-8">

        {/* ── Agent Debate ── */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-white font-semibold text-base">⚡ Agent Debate</h2>
          <span className="live-badge bg-emerald-500/15 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium">
            LIVE
          </span>
        </div>
        <p className="text-muted text-xs mb-6">
          Three specialized agents analyzed your idea simultaneously.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {AGENT_KEYS.map((key, i) => (
            <AgentCard
              key={key}
              agentKey={key}
              data={debate[key]}
              isLoading={false}
              autoStart={true}
              delay={i * 0.15}
            />
          ))}
        </div>

        {/* ── Scenario Simulation ── */}
        <h2 className="text-white font-semibold text-base mt-2 mb-2">📊 Outcome Scenarios</h2>
        <p className="text-muted text-xs mb-6">
          Three possible futures based on your assumptions.
        </p>

        <div className="flex flex-col gap-4">
          {SCENARIO_KEYS.map((key, i) => (
            <ScenarioCard
              key={key}
              type={key}
              data={blueprint.scenarios?.[key]}
              delay={0.6 + i * 0.15}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
