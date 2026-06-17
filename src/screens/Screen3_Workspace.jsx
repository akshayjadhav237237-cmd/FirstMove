import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import SystemHeader from "../components/SystemHeader";
import DashboardChassis from "../components/DashboardChassis";
import ConfidenceRing from "../components/ConfidenceRing";

const AGENT_KEYS = ["strategist", "risk_analyst", "devils_advocate"];
const SCENARIO_KEYS = ["optimistic", "neutral", "pessimistic"];

function getMomTestQuestion(dim, statement) {
  const s = (statement || "").toLowerCase();
  if (s.includes("landlord")) {
    if (dim === "DESIRABILITY") return "Ask Pune landlords: 'How did you find your last remote tenant? Walk me through the process from listing to signing.'";
    if (dim === "VIABILITY") return "Ask landlords: 'What paid listing platforms do you currently use? What makes that cost acceptable?'";
    return "Film a room video in 3 lighting setups. Ask tenants: 'Would you lease this flat solely based on this preview?'";
  }
  if (s.includes("student") || s.includes("internship")) {
    if (dim === "DESIRABILITY") return "Ask students: 'How did you track applications last semester? What happened when you forgot a follow-up deadline?'";
    if (dim === "VIABILITY") return "Ask students: 'What productivity tools do you currently pay for yourself? Why did you pay for those?'";
    return "Provide a Notion/Sheets tracker to 5 students. Observe if they keep it updated with active listings.";
  }
  if (dim === "DESIRABILITY") {
    return "Ask target users: 'Walk me through the last time you faced this issue. What did you do, and what was most frustrating?'";
  }
  if (dim === "VIABILITY") {
    return "Ask target users: 'What are you currently spending to deal with this? What else have you tried that failed?'";
  }
  return "Run a manual test (a Concierge or Wizard of Oz test) for one user. Ask: 'Did this manual result solve your problem?'";
}

// June 2025 Calendar Grid: June 1st is Sunday.
// Prev month days: May 26 - May 31.
const CALENDAR_DAYS = [
  { date: 26, current: false },
  { date: 27, current: false },
  { date: 28, current: false },
  { date: 29, current: false },
  { date: 30, current: false },
  { date: 31, current: false },
  ...Array.from({ length: 30 }, (_, i) => ({ date: i + 1, current: true }))
];

export default function Screen3_Workspace() {
  const { state, dispatch } = useSession();
  const { debate, blueprint } = state;
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Manage validation state locally (validated / tested)
  const [testedState, setTestedState] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize local tested state from assumptions matrix
  useEffect(() => {
    if (blueprint?.assumptions_matrix) {
      const initial = {};
      blueprint.assumptions_matrix.forEach((asm) => {
        initial[asm.id] = false; // default untested
      });
      setTestedState(initial);
    }
  }, [blueprint]);

  if (!blueprint || !debate) {
    return (
      <DashboardChassis activeTab="Workspace">
        <div className="h-screen flex items-center justify-center bg-canvas">
          <div className="text-center">
            <p className="text-zinc-500 dark:text-[#8a8f98] text-sm font-mono mb-4">NO_PLAN_DATA</p>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="btn-accent text-black px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            >
              RESTART →
            </button>
          </div>
        </div>
      </DashboardChassis>
    );
  }

  const toggleTested = (id) => {
    setTestedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate Average Rating
  const strategistScore = debate.strategist?.opportunity_score || 75;
  const riskScore = debate.risk_analyst?.risk_score || 75;
  const devilScore = debate.devils_advocate?.challenge_score || 75;
  const avgScore = Math.round((strategistScore + (100 - riskScore) + (100 - devilScore)) / 3);

  // Selected assumption details
  const activeAsm = blueprint.assumptions_matrix?.[selectedIndex] || blueprint.assumptions_matrix?.[0];
  const activeRoadmapStep = blueprint.prioritized_roadmap?.[selectedIndex] || blueprint.prioritized_roadmap?.[0];

  return (
    <DashboardChassis activeTab="Workspace">
      <SystemHeader />

      {/* ── Dashboard Welcome Header & Metrics Row ── */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-black/[0.06] dark:border-white/[0.06] pb-5 mb-5 transition-colors duration-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-[#f7f8f8]">
            Welcome to Workspace, Founder
          </h1>
          <p className="text-zinc-650 dark:text-[#8a8f98] text-xs mt-0.5">
            Audit protocol and validation roadmap for: <span className="font-mono text-[#EAB308]">{state.rawIdea ? `"${state.rawIdea.substring(0, 40)}..."` : "Untitled Idea"}</span>
          </p>
        </div>

        {/* Metrics capsules */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-[#EAB308] text-xs font-semibold">
              ↗
            </div>
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-[#f7f8f8]">3</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wide">Socratic Questions</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-[#EAB308] text-xs font-semibold">
              ↗
            </div>
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-[#f7f8f8]">3</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wide">Audited Nodes</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-[#EAB308] text-xs font-semibold">
              ↗
            </div>
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-[#f7f8f8]">3</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wide">Roadmap Steps</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-[#EAB308]/20 bg-[#EAB308]/5 flex items-center justify-center text-[#EAB308] text-xs font-semibold">
              ★
            </div>
            <div>
              <div className="text-base font-semibold text-[#EAB308]">{avgScore}</div>
              <div className="text-[9px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wide">Total Rating</div>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="btn-accent rounded-full py-2 px-6 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-200"
          >
            New Idea
          </button>
        </div>
      </div>

      {/* ── Three Column Dashboard Grid ── */}
      <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-12"} gap-6 min-h-0 flex-1 overflow-visible`}>
        
        {/* ══ COLUMN 1: Lead Agent Monitor & Confidence Curve (col-span-4) ══ */}
        <div className={`flex flex-col gap-6 ${isMobile ? "w-full" : "lg:col-span-4"}`}>
          
          {/* Card 1: Agent monitor video-feed style */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden relative shadow-md dark:shadow-lg aspect-[16/11] transition-colors duration-300">
            <img
              src="/agent_preview.png"
              alt="Strategist Advisor"
              className="w-full h-full object-cover opacity-85 dark:opacity-80"
            />
            {/* Top-left capsule badge */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 text-[9px] font-mono text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              SIMULATION_ACTIVE
            </div>
            
            {/* Top-right menu trigger */}
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-xs cursor-pointer hover:bg-black/60 transition-colors">
              •••
            </div>

            {/* Bottom overlays */}
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-xs font-mono text-white/60 tracking-widest block uppercase text-[8px]">ACTIVE_MONITOR</span>
              <span className="text-sm font-semibold tracking-wide">Lead Strategist Node</span>
            </div>

            <div className="absolute bottom-4 right-4">
              <button className="bg-black/50 border border-white/10 hover:bg-black/70 text-white rounded-full px-3.5 py-1 text-[9px] font-mono transition-colors cursor-pointer uppercase">
                Active
              </button>
            </div>
          </div>

          {/* Card 2: Confidence line chart */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 shadow-md dark:shadow-lg relative flex flex-col justify-between transition-colors duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wider">
                Confidence Matrix
              </span>
              <div className="flex gap-1 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] rounded-full p-0.5 text-[8px] font-mono">
                <button className="text-zinc-400 dark:text-[#62666d] px-1.5 py-0.5">1D</button>
                <button className="bg-[#EAB308] text-black rounded-full px-2 py-0.5 font-semibold">7D</button>
                <button className="text-zinc-400 dark:text-[#62666d] px-1.5 py-0.5">30D</button>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative w-full h-32 mt-3">
              {/* Tooltip floating */}
              <div
                className="absolute bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-semibold font-mono rounded-full px-3 py-1 shadow-md"
                style={{ top: "10px", left: "155px", transform: "translateX(-50%)" }}
              >
                {activeAsm ? `${activeAsm.confidence_assessment?.confidence_score}% - ${activeAsm.dimension}` : "75% - Score"}
              </div>

              <svg className="w-full h-full -scale-y-1" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EAB308" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#EAB308" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid guidelines */}
                <line x1="0" y1="10" x2="300" y2="10" stroke="rgba(0,0,0,0.03)" className="dark:stroke-white/[0.02]" strokeWidth="1" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0,0,0,0.03)" className="dark:stroke-white/[0.02]" strokeWidth="1" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(0,0,0,0.03)" className="dark:stroke-white/[0.02]" strokeWidth="1" />
                
                {/* Area under line */}
                <path d="M 0 10 Q 75 35, 150 78 T 300 65 L 300 0 L 0 0 Z" fill="url(#chartGrad)" />
                
                {/* Main line */}
                <path d="M 0 10 Q 75 35, 150 78 T 300 65" fill="none" stroke="#EAB308" strokeWidth="2.5" />
                
                {/* Active value pointer */}
                <circle cx="150" cy="78" r="4.5" fill="#EAB308" stroke="#ffffff" className="dark:stroke-[#1c1c1e]" strokeWidth="2" />
                <line x1="150" y1="0" x2="150" y2="78" stroke="rgba(0,0,0,0.12)" className="dark:stroke-white/[0.12]" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-[9px] font-mono text-[#62666d] mt-2 border-t border-black/[0.06] dark:border-white/[0.04] pt-2">
              <span>Desirability</span>
              <span>Viability</span>
              <span>Feasibility</span>
            </div>
          </div>
        </div>

        {/* ══ COLUMN 2: Milestone calendar & Assumptions Table (col-span-5) ══ */}
        <div className={`flex flex-col gap-6 ${isMobile ? "w-full" : "lg:col-span-5"}`}>
          
          {/* Card 1: Calendar timeline */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 shadow-md dark:shadow-lg flex flex-col gap-3 transition-colors duration-300">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase">
              <span>←</span>
              <span className="font-semibold tracking-widest text-zinc-900 dark:text-[#f7f8f8]">June 2025</span>
              <span>→</span>
            </div>
            
            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-[9px] font-mono text-zinc-400 dark:text-[#62666d] border-b border-black/[0.06] dark:border-white/[0.04] pb-1.5">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-mono text-zinc-650 dark:text-[#8a8f98]">
              {CALENDAR_DAYS.map((day, idx) => {
                const isStep1 = day.current && day.date === 2;
                const isStep2 = day.current && day.date === 15;
                const isStep3 = day.current && day.date === 26;
                const isToday = day.current && day.date === 20;

                return (
                  <div key={idx} className="relative flex flex-col items-center justify-center py-1">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                      isToday 
                        ? "bg-[#EAB308] text-black font-semibold" 
                        : day.current 
                          ? "text-zinc-800 dark:text-[#d0d6e0]" 
                          : "text-zinc-300 dark:text-[#62666d]/40"
                    }`}>
                      {day.date}
                    </span>
                    
                    {/* Small dot beneath step milestones */}
                    {(isStep1 || isStep2 || isStep3) && (
                      <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#EAB308]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Assumptions Audit Table */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 shadow-md dark:shadow-lg flex-1 flex flex-col min-h-0 transition-colors duration-300">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wider mb-3 block">
              Assumptions Matrix
            </span>

            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.04] text-[9px] font-mono text-zinc-400 dark:text-[#62666d] uppercase tracking-wider">
                    <th className="pb-2">Dimension</th>
                    <th className="pb-2">Assumption</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {(blueprint.assumptions_matrix || []).map((asm, i) => {
                    const isSelected = selectedIndex === i;
                    const isTested = testedState[asm.id];
                    return (
                      <tr
                        key={asm.id}
                        onClick={() => setSelectedIndex(i)}
                        className={`cursor-pointer transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02] ${
                          isSelected ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""
                        }`}
                      >
                        <td className="py-2.5 font-semibold text-zinc-900 dark:text-[#f7f8f8]">{asm.dimension}</td>
                        <td className={`py-2.5 max-w-[120px] truncate text-zinc-500 dark:text-[#8a8f98] ${isTested ? "line-through text-zinc-400 dark:text-[#62666d]" : ""}`}>
                          {asm.assumption_statement}
                        </td>
                        <td className="py-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTested(asm.id);
                            }}
                            className={`px-2 py-0.5 rounded text-[8px] font-mono border transition-all cursor-pointer uppercase ${
                              isTested
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-yellow-500/10 text-[#EAB308] border-yellow-500/20"
                            }`}
                          >
                            {isTested ? "VALIDATED" : "STANDBY"}
                          </button>
                        </td>
                        <td className="py-2.5 flex justify-end">
                          <div className="scale-75 origin-right">
                            <ConfidenceRing score={asm.confidence_assessment?.confidence_score} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ══ COLUMN 3: Guidelines tips panel & Sticky Disclaimer (col-span-3) ══ */}
        <div className={`flex flex-col gap-6 ${isMobile ? "w-full" : "lg:col-span-3"}`}>
          
          {/* Card 1: Validation Tips card */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 shadow-md dark:shadow-lg flex-1 flex flex-col gap-4 transition-colors duration-300">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-[#8a8f98] uppercase tracking-wider block">
              Validation Guidelines
            </span>

            {activeAsm && (
              <div className="space-y-4 flex-1">
                {/* Mom test block */}
                <div className="bg-black/[0.02] dark:bg-black/25 border border-black/[0.06] dark:border-white/[0.04] rounded-xl p-3.5">
                  <span className="text-[8px] font-mono text-zinc-450 dark:text-[#62666d] block mb-2 tracking-wider uppercase">
                    &gt; HOW_TO_INTERVIEW
                  </span>
                  <p className="text-zinc-900 dark:text-[#f7f8f8] text-xs leading-relaxed">
                    {getMomTestQuestion(activeAsm.dimension, activeAsm.assumption_statement)}
                  </p>
                </div>

                {/* Roadmap step block */}
                <div className="bg-black/[0.02] dark:bg-black/25 border border-black/[0.06] dark:border-white/[0.04] rounded-xl p-3.5">
                  <span className="text-[8px] font-mono text-zinc-450 dark:text-[#62666d] block mb-2 tracking-wider uppercase">
                    &gt; MITIGATION_ACTION
                  </span>
                  <p className="text-zinc-650 dark:text-[#8a8f98] text-xs leading-relaxed mb-2">
                    {activeRoadmapStep?.mitigation_action}
                  </p>
                  <span className="text-[9px] font-mono text-zinc-450 dark:text-[#62666d] block">
                    GOAL: {activeRoadmapStep?.test_metrics}
                  </span>
                </div>

                {/* Immediate Next step block */}
                <div className="bg-black/[0.02] dark:bg-black/25 border border-black/[0.06] dark:border-white/[0.04] rounded-xl p-3.5">
                  <span className="text-[8px] font-mono text-zinc-450 dark:text-[#62666d] block mb-2 tracking-wider uppercase">
                    &gt; IMMEDIATE_START
                  </span>
                  <p className="text-zinc-900 dark:text-[#d0d6e0] text-xs leading-relaxed font-semibold">
                    {blueprint.immediate_next_step?.action_item}
                  </p>
                </div>
              </div>
            )}

            {/* Sticky disclaimer footer positioned permanently inside column 3 */}
            <div className="border-t border-black/[0.06] dark:border-white/[0.04] pt-4 mt-auto">
              <p className="text-[9px] font-mono text-zinc-400 dark:text-[#62666d] leading-relaxed text-center uppercase">
                DISCLAIMER: FirstMove is an AI tool. All insights, metrics, and roadmaps are probabilistic models. The final decision remains with the founder.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardChassis>
  );
}
