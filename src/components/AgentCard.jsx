import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfidenceRing from "./ConfidenceRing";

const smoothSpring = { type: "spring", stiffness: 450, damping: 32, mass: 1 };

const AGENT_CONFIG = {
  strategist: {
    name: "Lead Strategist",
    role: "OPPORTUNITY_ANALYSIS",
    color: "#7C3AED",
    beamClass: "border-beam border-beam-strategist",
    tintBg: "rgba(124,58,237,0.02)",
    scoreKey: "opportunity_score",
    scoreLabel: "OPP_SCORE",
  },
  risk_analyst: {
    name: "Risk Analyst",
    role: "THREAT_ASSESSMENT",
    color: "#F87171",
    beamClass: "border-beam border-beam-risk",
    tintBg: "rgba(248,113,113,0.02)",
    scoreKey: "risk_score",
    scoreLabel: "RISK_SCORE",
  },
  devils_advocate: {
    name: "Devil's Advocate",
    role: "CHALLENGE_ASSESSMENT",
    color: "#FB923C",
    beamClass: "border-beam border-beam-devil",
    tintBg: "rgba(251,146,60,0.02)",
    scoreKey: "challenge_score",
    scoreLabel: "CHAL_SCORE",
  },
};

function WordByWordReveal({ text, onDone }) {
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
        if (onDone) onDone();
      }
    }, 20); // 20ms per word
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const isDone = revealedCount >= words.length;

  return (
    <span>
      {words.map((word, idx) => {
        const revealed = idx < revealedCount;
        return (
          <motion.span
            key={idx}
            className="inline-block"
            initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
            animate={revealed ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(4px)", y: 2 }}
            transition={{ type: "spring", stiffness: 450, damping: 32, mass: 1 }}
          >
            {word}
          </motion.span>
        );
      })}
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "steps(2)" }}
          className="inline-block w-1.5 h-4 ml-0.5 bg-emerald-400 align-middle"
        />
      )}
    </span>
  );
}

export default function AgentCard({ agentKey, data, isLoading = false, autoStart = false, delay = 0 }) {
  const cfg = AGENT_CONFIG[agentKey] || AGENT_CONFIG.strategist;
  const [verdictDone, setVerdictDone] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [started, setStarted] = useState(false);

  const isTyping = started && !verdictDone;
  const score = data?.[cfg.scoreKey];

  // Delay reveal start
  useEffect(() => {
    if (!autoStart || !data) return;
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [autoStart, data, delay]);

  // Show points after verdict done
  useEffect(() => {
    if (verdictDone) {
      const t = setTimeout(() => setShowPoints(true), 200);
      return () => clearTimeout(t);
    }
  }, [verdictDone]);

  const beamActive = isLoading || isTyping;

  const cardBase = "rounded-lg overflow-hidden mb-4";
  const typingTintStyle = isTyping ? { background: cfg.tintBg } : {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, ...smoothSpring }}
      className={`${cardBase} ${beamActive ? cfg.beamClass : "bg-white dark:bg-[#0c0d10] border border-black/[0.06] dark:border-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors duration-200"}`}
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(0,0,0,0.4)",
        ...typingTintStyle
      }}
    >
      {/* ── Card Header ── */}
      <div className="h-10 flex items-center justify-between px-4 bg-black/[0.01] border-b border-black/[0.06] dark:border-white/[0.04]">
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-sm mr-2.5 flex-shrink-0"
            style={{ backgroundColor: cfg.color }}
          />
          <span className="text-xs font-semibold text-zinc-900 dark:text-[#f7f8f8]">{cfg.name}</span>
          <span className="w-px h-3 bg-black/10 dark:bg-white/10 mx-2" />
          <span className="text-[9px] font-mono text-zinc-500 dark:text-[#62666d] uppercase tracking-widest bg-black/[0.03] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
            {cfg.role}
          </span>
        </div>

        <div className="flex items-center">
          {isTyping && (
            <span className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              RUNNING_NODE
            </span>
          )}
          {!isTyping && data && score !== undefined && (
            <ConfidenceRing score={score} strokeColor={cfg.color} />
          )}
          {isLoading && (
            <span className="flex gap-0.5">
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
              <span className="typing-dot" style={{ backgroundColor: cfg.color }} />
            </span>
          )}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="skeleton-shimmer h-2.5 w-4/5 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
            <div className="skeleton-shimmer h-2.5 w-full rounded bg-black/[0.05] dark:bg-white/[0.05]" />
            <div className="skeleton-shimmer h-2.5 w-3/4 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
            <div className="skeleton-shimmer h-2.5 w-5/6 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
          </div>
        ) : data ? (
          <div>
            {/* Verdict */}
            <p className="text-zinc-600 dark:text-[#8a8f98] text-xs leading-relaxed mb-0">
              {autoStart && started ? (
                <WordByWordReveal text={data.verdict} onDone={() => setVerdictDone(true)} />
              ) : (
                <span>{data.verdict}</span>
              )}
            </p>

            {/* Key points */}
            <AnimatePresence>
              {showPoints && data.key_points && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2"
                >
                  {data.key_points.map((point, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, ...smoothSpring }}
                    >
                      <span className="text-xs shrink-0 mt-0.5" style={{ color: cfg.color }}>–</span>
                      <p className="text-zinc-600 dark:text-[#8a8f98] text-xs leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reasoning toggle */}
            {verdictDone && (
              <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  onClick={() => setShowReasoning((v) => !v)}
                  className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-[#62666d] hover:text-zinc-900 dark:hover:text-[#8a8f98] transition-colors cursor-pointer"
                >
                  <span>{showReasoning ? "HIDE_LOG ↑" : "DATA_LINEAGE_LOG ↓"}</span>
                </button>
                <AnimatePresence>
                  {showReasoning && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-black/[0.02] dark:bg-black/30 rounded-md p-3 mt-2 border border-black/[0.06] dark:border-white/[0.04]">
                        <p className="font-mono text-xs text-zinc-500 dark:text-[#62666d] leading-relaxed mb-2">
                          Contributing factors extracted from context window analysis...
                        </p>
                        {(data.key_points || []).map((pt, i) => (
                          <p key={i} className="font-mono text-xs text-zinc-600 dark:text-[#8a8f98] leading-relaxed mb-1">
                            {"  > "}{pt}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-[#62666d] text-xs font-mono">AWAITING_INPUT_SIGNAL...</p>
        )}
      </div>
    </motion.div>
  );
}
