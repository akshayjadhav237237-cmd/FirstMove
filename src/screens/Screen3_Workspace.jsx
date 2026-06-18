import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";

function getMomTestQuestion(dim, statement) {
  const s = (statement || "").toLowerCase();
  if (s.includes("landlord")) {
    if (dim === "DESIRABILITY") return "Talk to 3 landlords. Ask: 'How did you find your last remote tenant? Walk me through the process from listing to contract.'";
    if (dim === "VIABILITY") return "Talk to 3 landlords. Ask: 'What tools or packages do you currently pay for to list or manage your properties? What does it cost?'";
    return "Film a quick video of your own room under 3 lighting conditions. Ask: 'Is this quality clear enough to make a rental decision?'";
  }
  if (s.includes("student") || s.includes("internship")) {
    if (dim === "DESIRABILITY") return "Talk to 3 students. Ask: 'How do you keep track of your internship applications today? What happened the last time you missed a deadline?'";
    if (dim === "VIABILITY") return "Talk to 3 students. Ask: 'What productivity tools (like Notion or Spotify) do you pay for yourself? What would make this tool worth paying for?'";
    return "Build a single-page tracker in Notion/Sheets. Send it to 5 students and observe if they use it for their active listings.";
  }
  
  if (dim === "DESIRABILITY") {
    return `Talk to 3 target users. Ask: "Walk me through the last time you faced this problem. What did you do to solve it? (Do not mention your idea)."`;
  }
  if (dim === "VIABILITY") {
    return `Talk to 3 target users. Ask: "What are you currently spending (in time or money) to deal with this? What makes that cost acceptable or unacceptable?"`;
  }
  return `Run a manual test (a Concierge or Wizard of Oz test) for one user. Ask: "Did the manual workflow solve your core problem?"`;
}

const AGENTS = [
  {
    key: "strategist",
    initials: "LS",
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    color: "#6366F1",
    barBg: "bg-[#6366F1]",
    circleBg: "bg-[#6366F1]/15 text-[#6366F1]",
    roleColor: "text-[#6366F1]",
    scoreKey: "opportunity_score",
  },
  {
    key: "risk_analyst",
    initials: "RA",
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    color: "#F43F5E",
    barBg: "bg-[#F43F5E]",
    circleBg: "bg-[#F43F5E]/15 text-[#F43F5E]",
    roleColor: "text-[#F43F5E]",
    scoreKey: "risk_score",
  },
  {
    key: "devils_advocate",
    initials: "DA",
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    color: "#F97316",
    barBg: "bg-[#F97316]",
    circleBg: "bg-[#F97316]/15 text-[#F97316]",
    roleColor: "text-[#F97316]",
    scoreKey: "challenge_score",
  },
];

function AgentDebateCard({ agent, debateData }) {
  const score = debateData?.[agent.scoreKey] || 0;
  const verdict = debateData?.verdict || "Calculating simulation node verdict...";
  const keyPoints = debateData?.key_points || [];

  const verdictWords = verdict.split(/\s+/);
  const totalRevealTime = verdictWords.length * 30; // in ms
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setShowCursor(true);
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, totalRevealTime + 300);
    return () => clearTimeout(timer);
  }, [verdict]);

  return (
    <div className="bg-[#0D1220] border border-white/[0.07] rounded-[20px] p-5 relative overflow-hidden flex flex-col h-full min-h-0 select-none">
      
      {/* TOP STRIPE (3px tall) */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${agent.barBg}`} />

      {/* INSIDE THE CARD */}
      <div className="pt-3 flex flex-col flex-1 min-h-0">
        
        {/* Header row */}
        <div className="flex justify-between items-center mb-4">
          {/* Large initial circle */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${agent.circleBg}`}>
            {agent.initials}
          </div>
          
          {/* Score badge */}
          <div className="text-xs font-mono bg-white/5 rounded-full px-2 py-1 text-[#94A3B8]">
            {score}/100
          </div>
        </div>

        {/* Agent Name & Role */}
        <h4 className="text-[#F1F5F9] font-semibold text-sm leading-none mb-1 uppercase">
          {agent.name}
        </h4>
        <span className={`text-[10px] uppercase tracking-wider font-semibold mb-4 font-mono ${agent.roleColor}`}>
          {agent.role}
        </span>

        {/* Verdict text */}
        <div className="text-[13px] text-[#94A3B8] leading-[1.65] flex-1 overflow-y-auto mb-3 pr-1">
          {verdictWords.map((word, idx) => (
            <span
              key={idx}
              className="reveal-word opacity-0"
              style={{
                animationDelay: `${idx * 30}ms`
              }}
            >
              {word}{" "}
            </span>
          ))}
          {showCursor && (
            <span 
              className="inline-block w-0.5 h-3.5 ml-0.5 align-middle animate-pulse" 
              style={{ backgroundColor: agent.color }} 
            />
          )}
        </div>

        {/* Key Points checklist */}
        <div 
          className="mt-2 pt-3 border-t border-white/[0.05] space-y-2 flex-shrink-0 opacity-0"
          style={{
            animation: 'wordIn 0.3s ease forwards',
            animationDelay: `${totalRevealTime + 150}ms`
          }}
        >
          {keyPoints.map((pt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs font-bold shrink-0" style={{ color: agent.color }}>
                ▸
              </span>
              <p className="text-[#475569] text-xs leading-relaxed">
                {pt}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default function Screen3_Workspace() {
  const { state, dispatch } = useSession();
  const { debate, blueprint } = state;

  const [expanded, setExpanded] = useState({});

  if (!blueprint || !debate) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#080C14] font-sans">
        <div className="text-center space-y-4">
          <p className="text-[#94A3B8] text-sm font-mono tracking-wider uppercase">NO_WORKSPACE_DATA</p>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="w-48 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-lg uppercase transition-colors"
          >
            Restart Setup
          </button>
        </div>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scenarios = blueprint?.scenarios || {};
  const optimismData = scenarios.optimistic || {};
  const neutralData = scenarios.neutral || {};
  const riskData = scenarios.pessimistic || {};

  const SCENARIO_TYPES = [
    {
      key: "optimistic",
      label: "Optimistic",
      bgCls: "bg-emerald-950/40 border border-emerald-500/20",
      textColor: "text-[#10B981]",
      barColor: "bg-[#10B981]",
      data: optimismData,
    },
    {
      key: "neutral",
      label: "Neutral",
      bgCls: "bg-slate-800/40 border border-slate-600/20",
      textColor: "text-[#64748B]",
      barColor: "bg-[#64748B]",
      data: neutralData,
    },
    {
      key: "pessimistic",
      label: "Risk Path",
      bgCls: "bg-red-950/40 border border-red-500/20",
      textColor: "text-[#EF4444]",
      barColor: "bg-[#EF4444]",
      data: riskData,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#080C14] overflow-hidden font-sans">
      
      {/* HEADER BAR */}
      <header className="h-12 border-b border-white/[0.06] bg-[#080C14] px-6 flex items-center justify-between flex-shrink-0 z-20 select-none">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-[#6366F1] text-white rounded font-bold text-xs uppercase tracking-tight">
            FM
          </div>
          <div className="text-xs text-[#94A3B8] font-mono flex items-center gap-2">
            <span>FirstMove</span>
            <span className="text-[#475569]">/</span>
            <span className="text-white">Workspace</span>
          </div>
          <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_#10B981] ml-2" />
          <span className="text-[9px] font-mono text-[#10B981] uppercase tracking-widest font-bold">
            ACTIVE_RUN
          </span>
        </div>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-3 py-1.5 border border-white/10 hover:border-[#6366F1]/50 hover:bg-white/5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg transition-colors font-semibold uppercase tracking-wider"
        >
          New Analysis
        </button>
      </header>

      {/* BENTO GRID DASHBOARD */}
      <main className="grid grid-cols-3 grid-rows-[280px_140px_1fr] gap-3 p-4 h-[calc(100vh-48px)] overflow-hidden min-h-0 flex-1">
        
        {/* ━━━ ROW 1: THREE AGENT CARDS ━━━ */}
        {AGENTS.map((agent) => (
          <div key={agent.key} className="h-full min-h-0">
            <AgentDebateCard agent={agent} debateData={debate} />
          </div>
        ))}

        {/* ━━━ ROW 2: PROBLEM STATEMENT + FIRSTMOVE ━━━ */}
        
        {/* Problem Statement Card */}
        <div className="col-span-2 bg-[#0D1220] border border-white/[0.07] rounded-[20px] p-6 flex flex-col min-h-0 select-none">
          <div className="text-xs uppercase tracking-widest text-[#475569] mb-3 font-semibold font-mono">
            PROBLEM STATEMENT
          </div>
          <div className="overflow-y-auto pr-1 flex-1">
            <p className="text-[22px] font-bold text-[#F1F5F9] leading-[1.4] tracking-tight">
              {blueprint.problem_statement || "No problem statement calculated."}
            </p>
          </div>
        </div>

        {/* FirstMove Action Card */}
        <div 
          className="col-span-1 border rounded-[20px] p-6 flex flex-col min-h-0"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
            borderColor: "rgba(99,102,241,0.3)",
          }}
        >
          <div className="text-xs uppercase tracking-widest text-[#6366F1] mb-3 font-semibold font-mono">
            YOUR FIRSTMOVE
          </div>
          <div className="overflow-y-auto pr-1 flex-1 mb-2">
            <h4 className="text-[#F1F5F9] font-bold text-base leading-snug mb-1">
              {blueprint.immediate_next_step?.action_item || "Validate core value premise first."}
            </h4>
            <p className="text-[#94A3B8] text-sm">
              {blueprint.immediate_next_step?.rationale_objective}
            </p>
          </div>
          <div className="text-[#475569] text-[10px] font-mono italic border-t border-white/[0.06] pt-3 mt-auto">
            DISCLAIMER: FirstMove is an AI tool. All insights are probabilistic.
          </div>
        </div>

        {/* ━━━ ROW 3: ASSUMPTIONS + ROADMAP + SCENARIOS ━━━ */}

        {/* Assumptions Card */}
        <div className="col-span-1 bg-[#0D1220] border border-white/[0.07] rounded-[20px] p-5 flex flex-col min-h-0 overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-[#475569] mb-4 font-semibold font-mono select-none">
            ASSUMPTIONS
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {(blueprint.assumptions_matrix || []).map((asm, idx) => {
              const isExpanded = expanded[asm.id];
              const dim = (asm.dimension || "DESIRABILITY").toUpperCase();
              const badgeColor =
                dim === "DESIRABILITY"
                  ? "bg-[#6366F1]/10 text-[#6366F1]"
                  : dim === "VIABILITY"
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[#F97316]/10 text-[#F97316]";
              return (
                <div key={asm.id || idx} className="mb-4 pb-4 border-b border-white/[0.05] last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center gap-2 select-none">
                    <span className={`rounded-full text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider ${badgeColor}`}>
                      {dim}
                    </span>
                    <span className="text-xs font-mono text-[#475569]">
                      {asm.confidence_assessment?.confidence_score}%
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-xs leading-relaxed mt-2 font-medium">
                    {asm.assumption_statement}
                  </p>

                  <button
                    onClick={() => toggleExpand(asm.id)}
                    className="text-xs text-[#6366F1] hover:underline cursor-pointer select-none mt-2 block w-max"
                  >
                    {isExpanded ? "Collapse Analysis ↑" : "Expand Analysis ↓"}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 select-none">
                      <div className="bg-[#111827] rounded-lg p-3 text-[11px] font-mono text-[#94A3B8] border border-white/[0.05] space-y-1">
                        <div className="text-[#475569] text-[10px] mb-1 font-bold">// RISK FACTORS:</div>
                        {(asm.confidence_assessment?.contributing_factors || []).map((f, i) => (
                          <div key={i}>▸ {f}</div>
                        ))}
                      </div>
                      <div className="bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-lg p-3 text-xs text-[#94A3B8]">
                        <div className="text-[#6366F1] text-[10px] mb-1 font-bold">// VALIDATION METHOD:</div>
                        {getMomTestQuestion(dim, asm.assumption_statement)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap Card */}
        <div className="col-span-1 bg-[#0D1220] border border-white/[0.07] rounded-[20px] p-5 flex flex-col min-h-0 overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-[#475569] mb-4 font-semibold font-mono select-none">
            ROADMAP
          </div>
          <div className="flex-1 overflow-y-auto pr-1 relative pl-8 select-none">
            {/* Vertical Line */}
            <div className="absolute left-[16px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#6366F1] to-[#6366F1]/10" />

            {(blueprint.prioritized_roadmap || []).map((step, idx) => (
              <div key={idx} className="relative mb-6 last:mb-0">
                {/* Step dot */}
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />

                <div className="text-[9px] font-mono text-[#6366F1]/60 uppercase mb-1">
                  STEP 0{idx + 1}
                </div>
                <div className="text-[#F1F5F9] text-xs font-semibold leading-snug">
                  {step.mitigation_action}
                </div>
                <div className="text-[#475569] text-[10px] font-mono mt-1">
                  METRIC: {step.test_metrics}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenarios Card */}
        <div className="col-span-1 bg-[#0D1220] border border-white/[0.07] rounded-[20px] p-5 flex flex-col min-h-0 overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-[#475569] mb-4 font-semibold font-mono select-none">
            SCENARIOS
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {SCENARIO_TYPES.map((sc) => {
              const probability = sc.data.probability || 0.5;
              return (
                <div key={sc.key} className={`rounded-xl p-3 ${sc.bgCls}`}>
                  <div className="flex justify-between items-center mb-1 select-none">
                    <span className={`font-semibold text-xs ${sc.textColor}`}>
                      {sc.label}
                    </span>
                    <span className="text-xs font-mono text-[#475569]">
                      {Math.round(probability * 100)}% LIKELY
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-xs leading-snug mt-1 mb-1 font-medium select-none">
                    {sc.data.headline || "Calculated projection payload..."}
                  </p>
                  <div className="text-[#475569] text-[10px] font-mono select-none">
                    TIMELINE: {sc.data.estimated_timeline || "N/A"}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-0.5 bg-white/5 rounded-full mt-2 overflow-hidden select-none">
                    <div className={`h-full ${sc.barColor}`} style={{ width: `${Math.round(probability * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

    </div>
  );
}
