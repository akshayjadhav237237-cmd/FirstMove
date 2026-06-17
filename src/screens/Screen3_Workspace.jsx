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
    color: "#A5B4FC",
    scoreKey: "opportunity_score",
    scoreLabel: "OPP_SCORE",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    color: "#FCA5A5",
    scoreKey: "risk_score",
    scoreLabel: "RISK_SCORE",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    color: "#FDBA74",
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
      <div className="h-screen w-screen flex items-center justify-center bg-[#F3F2EE]">
        <div className="text-center space-y-4">
          <p className="text-black/55 text-sm font-mono tracking-wider uppercase">NO_WORKSPACE_DATA</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="btn-brutal px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer"
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
    <div className="w-full flex-1 flex flex-col h-screen overflow-hidden bg-[#F3F2EE] relative text-black">
      
      {/* ── HEADER BAR ── */}
      <header className="h-14 flex items-center justify-between px-6 bg-white border-b-3 border-black z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded bg-[#FAF9F6] border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <span className="font-extrabold text-xs text-black tracking-tight">FM</span>
            <span className="text-black/75 text-[10px] font-mono uppercase tracking-wider font-bold">· FirstMove</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
          <span className="text-[10px] font-mono text-black uppercase tracking-widest font-extrabold">
            Analysis complete
          </span>
        </div>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-4 py-1.5 text-xs font-mono text-black hover:bg-[#FAF9F6] border-2 border-black rounded cursor-pointer transition-all duration-100 shadow-[2px_2px_0px_#000]"
        >
          Start over
        </button>
      </header>

      {/* ── MAIN AREA ── */}
      <main className="flex flex-1 gap-3 p-3 h-[calc(100vh-56px)] overflow-hidden z-10 min-h-0">
        
        {/* ══ LEFT PANEL: Workspace Blueprint Document (42% width) ══ */}
        <div className="w-[42%] brutal-panel overflow-y-auto p-6 flex flex-col max-h-full">
          
          {/* Concept summary */}
          <span className="mono-label text-[10px] text-black/50 mb-3 block font-bold">
            Startup Idea Concept
          </span>
          <div className="border-l-3 border-black pl-4 mb-8">
            <p className="text-black/75 text-sm leading-relaxed font-semibold">
              {state.rawIdea || "Untitled startup concept idea."}
            </p>
          </div>

          {/* Assumptions Swarm Matrix */}
          <span className="mono-label text-[10px] text-black/50 mb-3 block font-bold">
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
          <span className="mono-label text-[10px] text-black/50 mb-4 block font-bold">
            Prioritized Roadmap
          </span>
          <div className="mb-4 relative border-l-2 border-black pl-6 ml-3 space-y-6">
            {(blueprint.prioritized_roadmap || []).map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                
                {/* Timeline Dot */}
                <div 
                  className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#FDE68A] border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                >
                  <span className="text-[8px] font-extrabold text-black">{idx + 1}</span>
                </div>

                <h3 className="text-black font-extrabold text-xs leading-snug">
                  {step.mitigation_action}
                </h3>
                <p className="text-black/75 text-xs mt-1.5 leading-relaxed font-medium">
                  {step.test_metrics}
                </p>
                <span className="text-black/45 text-[9px] font-mono mt-1.5 uppercase tracking-wide font-bold">
                  TIMELINE_WEEK: {step.estimated_week || `WEEK_0${idx + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* FirstMove Card (special) */}
          <div 
            className="rounded-lg p-5 mt-6 border-3 border-black flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, rgba(165,180,252,0.2), rgba(167,243,208,0.15))",
              boxShadow: "4px 4px 0px #000"
            }}
          >
            <div>
              <span className="mono-label text-[9px] text-black block mb-2 font-extrabold tracking-widest">
                &gt; Immediate Next Action Step
              </span>
              <h4 className="text-black font-extrabold text-base leading-snug">
                {blueprint.immediate_next_step?.action_item || "Validate core value premise first."}
              </h4>
              <p className="text-black/70 text-xs mt-2 leading-relaxed font-semibold">
                Objective: {blueprint.immediate_next_step?.rationale_objective || "Observe user friction under manual testing conditions."}
              </p>
            </div>

            <p className="text-black/45 text-[10px] font-mono italic mt-6 border-t border-black/10 pt-4 font-bold">
              DISCLAIMER: FirstMove is an AI tool. All insights, metrics, and roadmaps are probabilistic models. The final decision remains with the founder.
            </p>
          </div>

        </div>

        {/* ══ RIGHT PANEL: Agent Debate & Scenarios (58% width) ══ */}
        <div className="w-[58%] flex flex-col gap-3 max-h-full">
          
          {/* TOP HALF: Agent Debate Grid (flex-1) */}
          <div className="flex-1 brutal-panel overflow-y-auto p-5 flex flex-col">
            <span className="mono-label text-[10px] text-black/50 mb-5 block font-bold">
              Agent Debate
            </span>

            <div className="space-y-4 flex-1">
              {AGENT_KEYS.map((agent) => {
                const data = debate[agent.key];
                const score = data?.[agent.scoreKey];
                return (
                  <div key={agent.key} className="border-2 border-black rounded-lg p-4 bg-[#FAF9F6]/20 shadow-[2px_2px_0px_#000] mb-3">
                    
                    {/* Top Accent line */}
                    <div 
                      className="h-1.5 w-full rounded-full border border-black mb-3"
                      style={{ backgroundColor: agent.color }}
                    />

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div 
                          className={`w-8 h-8 rounded border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1.5px_1.5px_0px_#000] ${agent.key === 'strategist' ? 'bg-[#A5B4FC]' : agent.key === 'risk_analyst' ? 'bg-[#FCA5A5]' : 'bg-[#FDBA74]'}`}
                        >
                          <span className="font-extrabold text-black text-xs tracking-tight">
                            {agent.initials}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-black font-extrabold text-sm leading-none">
                            {agent.name}
                          </h4>
                        </div>
                        <span 
                          className="text-[9px] font-mono uppercase tracking-wider rounded border-2 border-black px-2.5 py-0.5 shadow-[1.5px_1.5px_0px_#000]"
                          style={{ 
                            backgroundColor: agent.color, 
                          }}
                        >
                          {agent.role}
                        </span>
                      </div>

                      {score !== undefined && (
                        <span className="text-black/60 text-[10px] font-mono font-bold">
                          {agent.scoreLabel}: {score}%
                        </span>
                      )}
                    </div>

                    {/* Verdict WordReveal */}
                    <p className="text-black/70 text-xs leading-relaxed mt-1 font-semibold">
                      <WordByWordReveal text={data?.verdict || "Awaiting simulation signal..."} />
                    </p>

                    {/* Key points */}
                    {data?.key_points && (
                      <div className="mt-3.5 pt-3 border-t border-black/10 space-y-2">
                        {data.key_points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span 
                              className="text-[11px] leading-none shrink-0 font-extrabold" 
                              style={{ color: "#000" }}
                            >
                              ▸
                            </span>
                            <p className="text-black/60 text-[11px] leading-relaxed font-semibold">
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
            <div className="flex-1 brutal-panel p-4 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                  <h4 className="text-black font-extrabold text-sm">Optimistic</h4>
                </div>
                <span className="text-black/40 text-[10px] font-mono font-bold">
                  {Math.round((optimismData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-black/70 text-xs leading-snug mt-2 font-semibold">
                  {optimismData.headline || "Premise achieves positive viral loops."}
                </p>
              </div>
              <div>
                <span className="text-black/35 text-[10px] font-mono font-bold">
                  TIMELINE: {optimismData.estimated_timeline || "N/A"}
                </span>
                <div className="h-1 mt-3 bg-emerald-400 w-full rounded border-t-2 border-black" />
              </div>
            </div>

            {/* Neutral */}
            <div className="flex-1 brutal-panel p-4 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-450 border border-black" />
                  <h4 className="text-black font-extrabold text-sm">Neutral</h4>
                </div>
                <span className="text-black/40 text-[10px] font-mono font-bold">
                  {Math.round((neutralData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-black/70 text-xs leading-snug mt-2 font-semibold">
                  {neutralData.headline || "Growth scales at typical industry baseline."}
                </p>
              </div>
              <div>
                <span className="text-black/35 text-[10px] font-mono font-bold">
                  TIMELINE: {neutralData.estimated_timeline || "N/A"}
                </span>
                <div className="h-1 mt-3 bg-white w-full rounded border-t-2 border-black" />
              </div>
            </div>

            {/* Risk / Pessimistic */}
            <div className="flex-1 brutal-panel p-4 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black" />
                  <h4 className="text-black font-extrabold text-sm">Risk Path</h4>
                </div>
                <span className="text-black/40 text-[10px] font-mono font-bold">
                  {Math.round((riskData.probability || 0) * 100)}% LIKELY
                </span>
                <p className="text-black/70 text-xs leading-snug mt-2 font-semibold">
                  {riskData.headline || "High churn levels or low initial response rate."}
                </p>
              </div>
              <div>
                <span className="text-black/35 text-[10px] font-mono font-bold">
                  TIMELINE: {riskData.estimated_timeline || "N/A"}
                </span>
                <div className="h-1 mt-3 bg-red-400 w-full rounded border-t-2 border-black" />
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
