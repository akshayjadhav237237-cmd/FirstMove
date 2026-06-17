import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import AssumptionCard from "../components/AssumptionCard";

function WordByWordReveal({ text }) {
  const words = text ? text.split(/(\s+)/) : [];
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!text || words.length === 0) return;
    setRevealedCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= words.length) {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {words.map((word, idx) => {
        const revealed = idx < revealedCount;
        return (
          <span
            key={idx}
            className={revealed ? "reveal-word text-[#33ff33]" : "opacity-0"}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

function getASCIIProgressBar(probability) {
  const totalBlocks = 16;
  const filledBlocks = Math.min(totalBlocks, Math.max(0, Math.round((probability || 0) * totalBlocks)));
  const emptyBlocks = totalBlocks - filledBlocks;
  return `[${"█".repeat(filledBlocks)}${"░".repeat(emptyBlocks)}]`;
}

const AGENT_KEYS = [
  {
    key: "strategist",
    initials: "LS",
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    scoreKey: "opportunity_score",
    scoreLabel: "OPP_SCORE",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    scoreKey: "risk_score",
    scoreLabel: "RISK_SCORE",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    scoreKey: "challenge_score",
    scoreLabel: "CHAL_SCORE",
  },
];

export default function Screen3_Workspace() {
  const { state, dispatch } = useSession();
  const { debate, blueprint } = state;

  // Manage tested state locally for assumptions
  const [testedState, setTestedState] = useState({});

  useEffect(() => {
    if (blueprint?.assumptions_matrix) {
      const initial = {};
      blueprint.assumptions_matrix.forEach((asm) => {
        initial[asm.id] = false;
      });
      setTestedState(initial);
    }
  }, [blueprint]);

  if (!blueprint || !debate) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050805] font-mono">
        <div className="text-center space-y-4">
          <p className="text-[#33ff33]/40 text-sm tracking-wider uppercase">[ NO_CORE_SIMULATION_DATA_FOUND ]</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="btn-terminal px-6 py-2.5 text-sm cursor-pointer"
          >
            [ REBOOT SETUP PROTOCOL ]
          </button>
        </div>
      </div>
    );
  }

  const toggleTested = (id) => {
    setTestedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scenarios = blueprint?.scenarios || {};
  const optimismData = scenarios.optimistic || {};
  const neutralData = scenarios.neutral || {};
  const riskData = scenarios.pessimistic || {};

  return (
    <div className="w-full flex-1 flex flex-col h-screen overflow-hidden bg-[#050805] relative text-[#33ff33] font-mono">
      
      {/* ── HEADER BAR ── */}
      <header className="h-14 flex items-center justify-between px-6 bg-[#050905] border-b border-[#1b4d1b] z-20 flex-shrink-0 shadow-[0_0_8px_rgba(51,255,51,0.15)]">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#050c05] border border-[#1b4d1b] flex items-center gap-1.5">
            <span className="font-bold text-xs text-[#33ff33]">FM</span>
            <span className="text-[#33ff33]/50 text-[10px] uppercase tracking-wider font-semibold">:: SYSTEM_CONSOLE</span>
          </div>
          <span className="w-1.5 h-1.5 bg-[#33ff33] animate-pulse" style={{ boxShadow: "0 0 6px #33ff33" }} />
          <span className="text-[10px] text-[#33ff33] uppercase tracking-widest font-semibold">
            [ AUDIT_RUN_COMPLETE ]
          </span>
        </div>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-4 py-1.5 text-xs text-[#33ff33]/70 hover:text-[#33ff33] border border-[#1b4d1b] hover:border-[#33ff33] bg-[#050c05] cursor-pointer transition-all duration-300"
        >
          [ REBOOT_SYSTEM ]
        </button>
      </header>

      {/* ── MAIN AREA ── */}
      <main className="flex flex-1 gap-3 p-3 h-[calc(100vh-56px)] overflow-hidden z-10 min-h-0">
        
        {/* ══ LEFT PANEL: Workspace Blueprint Document (42% width) ══ */}
        <div className="w-[42%] terminal-panel overflow-y-auto p-6 flex flex-col max-h-full bg-[#050905]">
          
          {/* Concept summary */}
          <span className="text-[10px] text-[#33ff33]/40 mb-3 block uppercase">
            // INPUT_RAW_IDEA_MEM_DUMP:
          </span>
          <div className="border border-[#1b4d1b] bg-[#050c05] p-4 mb-8">
            <p className="text-[#33ff33]/85 text-xs leading-relaxed">
              {state.rawIdea || "Untitled startup concept idea."}
            </p>
          </div>

          {/* Assumptions Swarm Matrix */}
          <span className="text-[10px] text-[#33ff33]/40 mb-3 block uppercase">
            // ASSUMPTION_MATRIX_NODES:
          </span>
          <div className="mb-8 space-y-3">
            {(blueprint.assumptions_matrix || []).map((asm, idx) => (
              <AssumptionCard
                key={asm.id || idx}
                assumption={asm}
                isTested={testedState[asm.id]}
                onToggleTested={toggleTested}
                index={idx}
              />
            ))}
          </div>

          {/* Prioritized Roadmap steps */}
          <span className="text-[10px] text-[#33ff33]/40 mb-4 block uppercase">
            // STEPWISE_MITIGATION_ROADMAP:
          </span>
          <div className="mb-4 relative border-l border-[#1b4d1b] pl-6 ml-3 space-y-6">
            {(blueprint.prioritized_roadmap || []).map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                
                {/* Timeline Dot Bracket */}
                <div 
                  className="absolute -left-[32px] top-0.5 w-5 h-5 rounded-none flex items-center justify-center bg-[#050805] border border-[#1b4d1b] text-[9px] font-bold text-[#33ff33]"
                >
                  {idx + 1}
                </div>

                <h3 className="text-[#33ff33] font-bold text-xs leading-snug uppercase">
                  &gt;&gt; {step.mitigation_action}
                </h3>
                <p className="text-[#33ff33]/70 text-xs mt-1.5 leading-relaxed font-mono">
                  METRICS: {step.test_metrics}
                </p>
                <span className="text-[#33ff33]/40 text-[9px] font-mono mt-1.5 uppercase tracking-wide">
                  TIMELINE_WEEK: {step.estimated_week || `WEEK_0${idx + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* FirstMove Card (special) */}
          <div className="border border-[#33ff33] bg-[#050c05] p-5 mt-6 transition-all duration-300 flex flex-col justify-between shadow-[0_0_8px_rgba(51,255,51,0.1)]">
            <div>
              <span className="text-[9px] text-[#33ff33] block mb-2 font-bold tracking-widest uppercase">
                &gt; PRIORITY_NEXT_ACTION_STEP:
              </span>
              <h4 className="text-[#33ff33] font-bold text-sm leading-snug uppercase">
                {blueprint.immediate_next_step?.action_item || "Validate core value premise first."}
              </h4>
              <p className="text-[#33ff33]/70 text-xs mt-2 leading-relaxed font-mono">
                OBJECTIVE: {blueprint.immediate_next_step?.rationale_objective || "Observe user friction under manual testing conditions."}
              </p>
            </div>

            <p className="text-[#33ff33]/30 text-[9px] font-mono italic mt-6 border-t border-[#1b4d1b]/40 pt-4">
              /* SYSTEM_WARNING: FirstMove insights are generated probabilistically using agent nodes. The human operator retains responsibility for execution. */
            </p>
          </div>

        </div>

        {/* ══ RIGHT PANEL: Agent Debate & Scenarios (58% width) ══ */}
        <div className="w-[58%] flex flex-col gap-3 max-h-full">
          
          {/* TOP HALF: Agent Debate Grid (flex-1) */}
          <div className="flex-1 terminal-panel overflow-y-auto p-5 flex flex-col bg-[#050905]">
            <span className="text-[10px] text-[#33ff33]/40 mb-5 block uppercase">
              // AGENT_SIMULATOR_DEBATE_LOGS:
            </span>

            <div className="space-y-4 flex-1">
              {AGENT_KEYS.map((agent) => {
                const data = debate[agent.key];
                const score = data?.[agent.scoreKey];
                return (
                  <div key={agent.key} className="border border-[#1b4d1b] p-4 flex flex-col bg-[#050705]">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3 border-b border-[#1b4d1b]/40 pb-2">
                      <div className="flex items-center gap-3">
                        {/* Avatar Box */}
                        <div className="w-8 h-8 border border-[#1b4d1b] flex items-center justify-center flex-shrink-0 bg-[#050c05] font-bold text-[#33ff33]">
                          {agent.initials}
                        </div>
                        <div>
                          <h4 className="text-[#33ff33] font-bold text-xs uppercase leading-none">
                            {agent.name}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wider rounded-none px-2 py-0.5 border border-[#1b4d1b] bg-[#050c05] text-[#33ff33]">
                          {agent.role}
                        </span>
                      </div>

                      {score !== undefined && (
                        <span className="text-[#33ff33]/60 text-[10px]">
                          [{agent.scoreLabel}: {score}%]
                        </span>
                      )}
                    </div>

                    {/* Verdict WordReveal */}
                    <p className="text-[#33ff33]/80 text-xs leading-relaxed mt-1">
                      <WordByWordReveal text={data?.verdict || "Awaiting simulation signal..."} />
                    </p>

                    {/* Key points */}
                    {data?.key_points && (
                      <div className="mt-3.5 pt-3 border-t border-[#1b4d1b]/40 space-y-2">
                        {data.key_points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[10px] shrink-0 text-[#33ff33]">
                              *
                            </span>
                            <p className="text-[#33ff33]/50 text-[10px] leading-relaxed">
                              {pt}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM HALF: 3 Scenarios side by side (240px fixed) */}
          <div className="h-[240px] flex gap-3 flex-shrink-0">
            
            {/* Optimistic */}
            <div className="flex-1 terminal-panel p-4 flex flex-col justify-between bg-[#050905]">
              <div>
                <div className="flex items-center gap-2 mb-1 border-b border-[#1b4d1b]/40 pb-1">
                  <span className="w-1.5 h-1.5 bg-[#33ff33] animate-pulse" />
                  <h4 className="text-[#33ff33] font-bold text-xs uppercase">Optimistic</h4>
                </div>
                <div className="text-[9px] text-[#33ff33]/50 font-bold uppercase tracking-wider">
                  PROBABILITY: {Math.round((optimismData.probability || 0) * 100)}%
                </div>
                <p className="text-[#33ff33]/80 text-xs leading-snug mt-2.5">
                  &gt; {optimismData.headline || "Premise achieves positive viral loops."}
                </p>
              </div>
              <div>
                <span className="text-[#33ff33]/40 text-[9px] uppercase">
                  TIMELINE: {optimismData.estimated_timeline || "N/A"}
                </span>
                <div className="text-[9px] text-[#33ff33] font-bold mt-2">
                  {getASCIIProgressBar(optimismData.probability)}
                </div>
              </div>
            </div>

            {/* Neutral */}
            <div className="flex-1 terminal-panel p-4 flex flex-col justify-between bg-[#050905]">
              <div>
                <div className="flex items-center gap-2 mb-1 border-b border-[#1b4d1b]/40 pb-1">
                  <span className="w-1.5 h-1.5 bg-[#33ff33]/60" />
                  <h4 className="text-[#33ff33] font-bold text-xs uppercase">Neutral</h4>
                </div>
                <div className="text-[9px] text-[#33ff33]/50 font-bold uppercase tracking-wider">
                  PROBABILITY: {Math.round((neutralData.probability || 0) * 100)}%
                </div>
                <p className="text-[#33ff33]/80 text-xs leading-snug mt-2.5">
                  &gt; {neutralData.headline || "Growth scales at typical industry baseline."}
                </p>
              </div>
              <div>
                <span className="text-[#33ff33]/40 text-[9px] uppercase">
                  TIMELINE: {neutralData.estimated_timeline || "N/A"}
                </span>
                <div className="text-[9px] text-[#33ff33]/70 font-bold mt-2">
                  {getASCIIProgressBar(neutralData.probability)}
                </div>
              </div>
            </div>

            {/* Risk / Pessimistic */}
            <div className="flex-1 terminal-panel p-4 flex flex-col justify-between bg-[#050905]">
              <div>
                <div className="flex items-center gap-2 mb-1 border-b border-[#1b4d1b]/40 pb-1">
                  <span className="w-1.5 h-1.5 bg-[#33ff33]/40" />
                  <h4 className="text-[#33ff33] font-bold text-xs uppercase">Risk Path</h4>
                </div>
                <div className="text-[9px] text-[#33ff33]/50 font-bold uppercase tracking-wider">
                  PROBABILITY: {Math.round((riskData.probability || 0) * 100)}%
                </div>
                <p className="text-[#33ff33]/80 text-xs leading-snug mt-2.5">
                  &gt; {riskData.headline || "High churn levels or low initial response rate."}
                </p>
              </div>
              <div>
                <span className="text-[#33ff33]/40 text-[9px] uppercase">
                  TIMELINE: {riskData.estimated_timeline || "N/A"}
                </span>
                <div className="text-[9px] text-[#33ff33]/50 font-bold mt-2">
                  {getASCIIProgressBar(riskData.probability)}
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
