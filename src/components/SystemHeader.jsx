import React from "react";

export default function SystemHeader({ simplified = false }) {
  return (
    <div className="flex items-center justify-between py-2 mb-4 border-b border-white/[0.04] text-[9px] font-mono text-[#62666d] uppercase tracking-wider">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />
        <span>Protocol: Socratic_Audit_Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Node: v4.1_Production</span>
      </div>
    </div>
  );
}
