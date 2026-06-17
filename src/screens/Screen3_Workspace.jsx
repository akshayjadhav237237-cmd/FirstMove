import React, { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useSession } from "../context/SessionContext";
import AssumptionCard from "../components/AssumptionCard";
import AgentCard from "../components/AgentCard";
import ScenarioCard from "../components/ScenarioCard";
import SystemHeader from "../components/SystemHeader";

const AGENT_KEYS = ["strategist", "risk_analyst", "devils_advocate"];
const SCENARIO_KEYS = ["optimistic", "neutral", "pessimistic"];

function SectionLabel({ label, meta }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono text-[#62666d] uppercase tracking-widest">{label}</span>
        {meta && <span className="text-[9px] font-mono text-[#62666d]">{meta}</span>}
      </div>
      <div className="border-t border-white/[0.04]" />
    </div>
  );
}

export default function Screen3_Workspace() {
  const { state, dispatch } = useSession();
  const { debate, blueprint } = state;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!blueprint || !debate) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="text-[#8a8f98] text-sm font-mono mb-4">NO_PLAN_DATA</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="btn-accent text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
          >
            RESTART →
          </button>
        </div>
      </div>
    );
  }

  const leftPanelContent = (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="h-10 flex-shrink-0 flex items-center justify-between px-4 bg-white/[0.01] border-b border-white/[0.04] border-r border-r-white/[0.04]">
        <span className="text-[10px] font-mono text-[#f7f8f8] font-semibold uppercase tracking-widest">
          SYSTEM_BLUEPRINTS
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-[#62666d]">NODE_MAP: v4</span>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="text-[9px] font-mono text-[#62666d] hover:text-[#8a8f98] transition-colors cursor-pointer"
          >
            RESTART →
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className={`p-5 bg-canvas ${isMobile ? "" : "flex-1 overflow-y-auto"}`}>
        {/* ── Sharpened problem ── */}
        <SectionLabel label="PROBLEM_STATEMENT" />
        <div
          className="bg-surface border border-white/[0.04] hover:border-white/[0.12] rounded-lg p-4 mb-6 transition-all duration-200"
          style={{
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(0,0,0,0.4)"
          }}
        >
          <p className="text-[#d0d6e0] text-sm leading-relaxed">
            {blueprint.sharpened_problem_statement}
          </p>
        </div>

        {/* ── Assumptions ── */}
        <SectionLabel label="LOAD_BEARING_ASSUMPTIONS" meta="test_red_first" />
        <div className="mb-6">
          {(blueprint.assumptions_matrix || []).map((asm, i) => (
            <AssumptionCard key={asm.id} assumption={asm} index={i} />
          ))}
        </div>

        {/* ── Roadmap ── */}
        <SectionLabel label="EXECUTION_ROADMAP" />
        <div className="mb-6">
          {(blueprint.prioritized_roadmap || []).map((step) => (
            <div key={step.sequence_number} className="flex items-start gap-3 mb-5">
              <div
                className="w-6 h-6 rounded-md bg-accent/[0.12] border border-accent/20 text-accent text-[10px] font-mono font-semibold flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                {step.sequence_number}
              </div>
              <div>
                <p className="text-[#d0d6e0] text-sm font-medium mb-1 leading-snug">
                  {step.mitigation_action}
                </p>
                <p className="text-[#62666d] text-[10px] font-mono leading-relaxed mb-2">
                  SUCCESS_WHEN: {step.test_metrics}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(step.target_assumptions || []).map((id) => (
                    <span
                      key={id}
                      className="text-[9px] font-mono text-accent/70 bg-accent/[0.06] border border-accent/15 rounded px-1.5 py-0.5"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FirstMove action ── */}
        <SectionLabel label="IMMEDIATE_ACTION" />
        <div
          className="border border-accent/30 bg-accent/[0.04] rounded-lg p-5 mb-8"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(108,99,255,0.15), 0 0 20px rgba(108,99,255,0.05)",
          }}
        >
          <p className="text-[9px] font-mono text-accent/70 uppercase tracking-widest mb-3">
            FIRSTMOVE_ACTION
          </p>
          <p className="text-[#f7f8f8] text-sm font-semibold leading-snug mb-2">
            {blueprint.immediate_next_step?.action_item}
          </p>
          <p className="text-[#8a8f98] text-xs mb-4 leading-relaxed">
             {blueprint.immediate_next_step?.objective}
          </p>
          <div className="border-t border-white/[0.04] pt-4">
            <p className="text-[#62666d] text-[10px] font-mono leading-relaxed">
              Whether this idea is worth pursuing is your call. FirstMove never decides that.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const rightPanelContent = (
    <div className="flex flex-col h-full bg-panel-r">
      {/* Panel header */}
      <div className="h-10 flex-shrink-0 flex items-center justify-between px-4 bg-white/[0.01] border-b border-white/[0.04]">
        <span className="text-[10px] font-mono text-[#f7f8f8] font-semibold uppercase tracking-widest">
          AGENT_COLLABORATION
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-[#8a8f98] uppercase">
            PIPELINE_ACTIVE
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className={`p-5 bg-panel-r ${isMobile ? "" : "flex-1 overflow-y-auto"}`}>
        {/* ── Agent Debate ── */}
        <SectionLabel label="AGENT_DEBATE" meta="simultaneous_analysis" />
        <div className="mb-2">
          {AGENT_KEYS.map((key, i) => (
            <AgentCard
              key={key}
              agentKey={key}
              data={debate[key]}
              isLoading={false}
              autoStart={true}
              delay={i * 0.3}
            />
          ))}
        </div>

        {/* ── Scenarios ── */}
        <SectionLabel label="OUTCOME_SCENARIOS" meta="probability_weighted" />
        <div>
          {SCENARIO_KEYS.map((key, i) => (
            <ScenarioCard
              key={key}
              type={key}
              data={blueprint.scenarios?.[key]}
              delay={0.9 + i * 0.15}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-screen h-screen bg-canvas overflow-hidden">
      <SystemHeader />

      <div className="flex-1 min-h-0">
        {isMobile ? (
          <div className="h-full overflow-y-auto bg-canvas flex flex-col divide-y divide-white/[0.04]">
            <div className="flex-shrink-0">{leftPanelContent}</div>
            <div className="flex-shrink-0">{rightPanelContent}</div>
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            {/* ══ LEFT PANEL ══ */}
            <Panel defaultSize={45} minSize={30} className="flex flex-col h-full">
              {leftPanelContent}
            </Panel>

            {/* ── Resize handle ── */}
            <PanelResizeHandle className="relative w-1 bg-canvas hover:bg-white/[0.04] transition-colors duration-150 cursor-col-resize group">
              <div className="absolute top-0 bottom-0 left-0 w-px bg-white/[0.04] group-hover:bg-white/[0.12] group-active:bg-accent/60 transition-all duration-150" />
            </PanelResizeHandle>

            {/* ══ RIGHT PANEL ══ */}
            <Panel defaultSize={55} minSize={35} className="flex flex-col h-full">
              {rightPanelContent}
            </Panel>
          </PanelGroup>
        )}
      </div>

      {/* Global permanently visible legal disclaimer */}
      <div className="h-8 flex-shrink-0 flex items-center justify-center bg-canvas border-t border-white/[0.04] px-4">
        <span className="text-[9px] font-mono text-[#62666d] uppercase tracking-wide text-center leading-none">
          DISCLAIMER: FirstMove is an AI tool. All insights, scores, and roadmaps are probabilistic models. The final decision to execute remains with the founder.
        </span>
      </div>
    </div>
  );
}
