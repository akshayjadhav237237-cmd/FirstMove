import React from "react";

export default function SystemHeader({ simplified = false }) {
  return (
    <div
      className="h-12 flex-shrink-0 flex items-center justify-between px-4 bg-surface border-b border-white/[0.06]"
      style={{ boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
          FM
        </div>
        <div className="w-px h-4 bg-white/10" />
        <span className="font-mono text-xs font-semibold text-[#f7f8f8] tracking-wide">
          FIRSTMOVE_TERMINAL
        </span>
        {!simplified && (
          <span className="text-[9px] font-mono text-[#62666d] uppercase tracking-widest hidden sm:block">
            MULTI_AGENT_INTELLIGENCE
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {!simplified && (
          <kbd className="h-5 px-1.5 rounded border border-white/10 bg-white/[0.02] font-mono text-[10px] text-[#8a8f98] flex items-center">
            ⌘K
          </kbd>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-[#8a8f98] uppercase tracking-wide">
            SYSTEM_READY
          </span>
        </div>
      </div>
    </div>
  );
}
