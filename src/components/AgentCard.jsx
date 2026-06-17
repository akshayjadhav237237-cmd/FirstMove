import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "../hooks/useTypewriter";
import { AgentSkeleton } from "./SkeletonLoader";

const AGENT_CONFIG = {
  strategist: {
    name: "Lead Strategist",
    role: "Opportunity Analysis",
    color: "#818CF8",
    beamClass: "border-beam border-beam-strategist",
    scoreLabel: "Opportunity Score",
    scoreKey: "opportunity_score",
    scoreColorCls: "bg-indigo-400/10 text-indigo-400",
  },
  risk_analyst: {
    name: "Risk Analyst",
    role: "Threat Assessment",
    color: "#F87171",
    beamClass: "border-beam border-beam-risk",
    scoreLabel: "Risk Score",
    scoreKey: "risk_score",
    scoreColorCls: "bg-red-400/10 text-red-400",
  },
  devils_advocate: {
    name: "Devil's Advocate",
    role: "Challenge Assessment",
    color: "#FB923C",
    beamClass: "border-beam border-beam-devil",
    scoreLabel: "Challenge Score",
    scoreKey: "challenge_score",
    scoreColorCls: "bg-orange-400/10 text-orange-400",
  },
};

export default function AgentCard({ agentKey, data, isLoading = false, autoStart = false, delay = 0 }) {
  const cfg = AGENT_CONFIG[agentKey] || AGENT_CONFIG.strategist;
  const [showPoints, setShowPoints] = useState(false);

  const { displayed, isDone, isStarted } = useTypewriter(
    data?.verdict || "",
    14,
    autoStart && !!data
  );

  const isTyping = isStarted && !isDone;

  useEffect(() => {
    if (isDone && data) {
      const t = setTimeout(() => setShowPoints(true), 300);
      return () => clearTimeout(t);
    }
  }, [isDone, data]);

  const beamActive = isLoading || isTyping;
  const score = data?.[cfg.scoreKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`relative rounded-xl p-5 ${beamActive ? cfg.beamClass : "bg-card border border-white/8"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
          <span className="text-white text-sm font-semibold">{cfg.name}</span>
        </div>
        <div>
          {isTyping && (
            <span className="flex items-center gap-0.5">
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
            </span>
          )}
          {!isTyping && data && score !== undefined && (
            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${cfg.scoreColorCls}`}>
              {score}/100
            </span>
          )}
        </div>
      </div>

      {/* Role tag */}
      <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: cfg.color + "99" }}>
        {cfg.role}
      </p>

      {/* Verdict */}
      <div className="min-h-[60px] mb-4">
        {isLoading ? (
          <AgentSkeleton />
        ) : data ? (
          <p className="text-secondary text-sm leading-relaxed">
            {autoStart ? displayed : data.verdict}
            {isTyping && <span className="animate-pulse">▍</span>}
          </p>
        ) : (
          <p className="text-muted text-sm italic">Waiting for your answers...</p>
        )}
      </div>

      {/* Key Points */}
      <AnimatePresence>
        {showPoints && data?.key_points && (
          <div className="space-y-2">
            {data.key_points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.25 }}
                className="flex items-start gap-2"
              >
                <span className="text-xs mt-0.5 shrink-0 font-bold" style={{ color: cfg.color }}>–</span>
                <p className="text-secondary text-xs leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
