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
            className={revealed ? "reveal-word" : "opacity-0"}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

const AGENT_KEYS = [
  {
    key: "strategist",
    initials: "LS",
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    color: "#818CF8",
    gradient: "linear-gradient(135deg, #4F46E5, #818CF8)",
    scoreKey: "opportunity_score",
    scoreLabel: "OPP_SCORE",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    color: "#F87171",
    gradient: "linear-gradient(135deg, #DC2626, #F87171)",
    scoreKey: "risk_score",
    scoreLabel: "RISK_SCORE",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    color: "#FB923C",
    gradient: "linear-gradient(135deg, #EA580C, #FB923C)",
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
      <div className="h-screen w-screen flex items-center justify-center bg-[#0c0c16]">
        <div className="text-center space-y-4">
          <p className="text-white/40 text-sm font-mono tracking-wider uppercase">NO_WORKSPACE_DATA</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="btn-spatial-pill px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer"
          >
            Restart Setup
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
    <div className="w-full flex-1 flex flex-col h-screen overflow-hidden bg-[#0c0c16] relative text-white">
      
      {/* ── HEADER BAR ── */}
      <header className="h-14 flex items-center justify-between px-6 backdrop-blur-md bg-white/[0.03] border-b border-white/10 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="font-extrabold text-xs text-white tracking-tight">FM</span>
            <span className="text-white/50 text-[10px] font-mono uppercase tracking-wider font-semibold">· FirstMove</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ boxShadow: "0 0 6px #fff" }} />
          <span className="text-[10px] font-mono text-white uppercase tracking-widest font-semibold">
            Analysis complete
          </span>
        </div>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-4 py-1.5 text-xs font-mono text-white/50 hover:text-white border border-white/5 hover:border-white/15 bg-white/2 rounded-full cursor-pointer transition-all duration-300"
        >
          Start over
        </button>
      </header>

      {/* ── MAIN AREA ── */}
      <main className="flex flex-1 gap-3 p-3 h-[calc(100vh-56px)] overflow-hidden z-10 min-h-0">
        
        {/* ══ LEFT PANEL: Workspace Blueprint Document (42% width) ══ */}
        <div className="w-[42%] glass-spatial overflow-y-auto p-6 flex flex-col max-h-full">
          
          {/* Concept summary */}
          <span className="mono-label text-[10px] text-white/30 mb-3 block">
            Startup Idea Concept
          </span>
          <div className="border-l-2 border-white/20 pl-4 mb-8">
            <p className="text-white/70 text-sm leading-relaxed font-medium">
              {state.rawIdea || "Untitled startup concept idea."}
            </p>
          </div>

          {/* Assumptions Swarm Matrix */}
          <span className="mono-label text-[10px] text-white/30 mb-3 block">
            Assumptions Swarm Matrix
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
          <span className="mono-label text-[10px] text-white/30 mb-4 block">
            Prioritized Roadmap
          </span>
          <div className="mb-4 relative border-l border-white/10 pl-6 ml-3 space-y-6">
            {(blueprint.prioritized_roadmap || []).map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                
                {/* Timeline Dot */}
                <div 
                  className="absolute -left-[30px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-[#0c0c16] border border-white/30 shadow-sm"
                >
                  <span className="text-[8px] font-bold text-white/80">{idx + 1}</span>
                </div>

                <h3 className="text-white font-semibold text-xs leading-snug">
                  {step.mitigation_action}
                </h3>
                <p className="text-white/60 text-xs mt-1.5 leading-relaxed font-medium">
                  {step.test_metrics}
                </p>
                <span className="text-white/30 text-[9px] font-mono mt-1.5 uppercase tracking-wide">
                  TIMELINE_WEEK: {step.estimated_week || `WEEK_0${idx + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* FirstMove Card (special) */}
          <div 
            className="rounded-2xl p-5 mt-6 border transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              borderColor: "rgba(255,255,255,0.22)",
              boxShadow: "0 0 24px rgba(255,255,255,0.1)"
            }}
          >
            <div>
              <span className="mono-label text-[8px] text-white/60 block mb-2 font-bold tracking-widest">
                &gt; Immediate Next Action Step
              </span>
              <h4 className="text-white font-bold text-base leading-snug">
                {blueprint.immediate_next_step?.action_item || "Validate core value premise first."}
              </h4>
              <p className="text-white/50 text-xs mt-2 leading-relaxed">
                Objective: {blueprint.immediate_next_step?.rationale_objective || "Observe user friction under manual testing conditions."}
              </p>
            </div>

            <p className="text-white/25 text-[10px] font-mono italic mt-6 border-t border-white/5 pt-4">
              DISCLAIMER: FirstMove is an AI tool. All insights, metrics, and roadmaps are probabilistic models. The final decision remains with the founder.
            </p>
          </div>

        </div>

        {/* ══ RIGHT PANEL: Agent Debate & Scenarios (58% width) ══ */}
        <div className="w-[58%] flex flex-col gap-3 max-h-full">
          
          {/* TOP HALF: Agent Debate Grid (flex-1) */}
          <div className="flex-1 glass-spatial overflow-y-auto p-5 flex flex-col">
            <span className="mono-label text-[10px] text-white/30 mb-5 block">
              Agent Debate
            </span>

            <div className="space-y-4 flex-1">
              {AGENT_KEYS.map((agent) => {
                const data = debate[agent.key];
                const score = data?.[agent.scoreKey];
                return (
                  <div key={agent.key} className="glass-spatial p-4 flex flex-col bg-white/5">
                    
                    {/* Top linear accent line */}
                    <div 
                      className="h-[2px] w-full rounded-full mb-3"
                      style={{ background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)` }}
                    />

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner border border-white/10"
                          style={{ background: agent.gradient }}
                        >
                          <span className="font-bold text-white text-xs tracking-tight">
                            {agent.initials}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm leading-none">
                            {agent.name}
                          </h4>
                        </div>
                        <span 
                          className="text-[9px] font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border"
                          style={{ 
                            color: agent.color, 
                            backgroundColor: `${agent.color}15`, 
                            borderColor: `${agent.color}25` 
                          }}
                        >
                          {agent.role}
                        </span>
                      </div>

                      {score !== undefined && (
                        <span className="text-white/50 text-[10px] font-mono">
                          {agent.scoreLabel}: {score}%
                        </span>
                      )}
                    </div>

                    {/* Verdict WordReveal */}
                    <p className="text-white/60 text-xs leading-relaxed mt-1">
                      <WordByWordReveal text={data?.verdict || "Awaiting simulation signal..."} />
                    </p>

                    {/* Key points */}
                    {data?.key_points && (
                      <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
                        {data.key_points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span 
                              className="text-[11px] leading-none shrink-0" 
                              style={{ color: `${agent.color}aa` }}
                            >
                              ▸
                            </span>
                            <p className="text-white/40 text-[11px] leading-relaxed">
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
            <div className="flex-1 glass-spatial p-4 flex flex-col justify-between bg-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
                  <h4 className="text-white font-semibold text-sm">Optimistic</h4>
                </div>
                <span className="text-white/30 text-[10px] font-mono">
                  {Math.round((optimismData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-white/60 text-xs leading-snug mt-2">
                  {optimismData.headline || "Premise achieves positive viral loops."}
                </p>
              </div>
              <div>
                <span className="text-white/25 text-[10px] font-mono">
                  TIMELINE: {optimismData.estimated_timeline || "N/A"}
                </span>
                <div className="h-0.5 rounded-full mt-3 bg-emerald-400/60 w-full" />
              </div>
            </div>

            {/* Neutral */}
            <div className="flex-1 glass-spatial p-4 flex flex-col justify-between bg-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" style={{ boxShadow: "0 0 6px #fbbf24" }} />
                  <h4 className="text-white font-semibold text-sm">Neutral</h4>
                </div>
                <span className="text-white/30 text-[10px] font-mono">
                  {Math.round((neutralData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-white/60 text-xs leading-snug mt-2">
                  {neutralData.headline || "Growth scales at typical industry baseline."}
                </p>
              </div>
              <div>
                <span className="text-white/25 text-[10px] font-mono">
                  TIMELINE: {neutralData.estimated_timeline || "N/A"}
                </span>
                <div className="h-0.5 rounded-full mt-3 bg-white/20 w-full" />
              </div>
            </div>

            {/* Risk / Pessimistic */}
            <div className="flex-1 glass-spatial p-4 flex flex-col justify-between bg-white/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" style={{ boxShadow: "0 0 6px #f87171" }} />
                  <h4 className="text-white font-semibold text-sm">Risk Path</h4>
                </div>
                <span className="text-white/30 text-[10px] font-mono">
                  {Math.round((riskData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-white/60 text-xs leading-snug mt-2">
                  {riskData.headline || "High churn levels or low initial response rate."}
                </p>
              </div>
              <div>
                <span className="text-white/25 text-[10px] font-mono">
                  TIMELINE: {riskData.estimated_timeline || "N/A"}
                </span>
                <div className="h-0.5 rounded-full mt-3 bg-red-400/60 w-full" />
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
