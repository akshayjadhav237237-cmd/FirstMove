import React from "react";
import { useSession } from "../context/SessionContext";

export default function DashboardChassis({ children, activeTab = "Workspace" }) {
  const { dispatch } = useSession();

  return (
    <div className="relative w-screen min-h-screen bg-[#050507] text-[#f7f8f8] flex items-center justify-center p-3 sm:p-6 overflow-x-hidden font-sans select-none">
      {/* Golden Backlight Reflection under Dashboard Frame */}
      <div className="dashboard-glow-bg" />

      {/* Main Glass Dashboard Chassis */}
      <div className="relative z-10 w-full max-w-6xl bg-[#131315]/90 border border-white/[0.06] rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 flex flex-col gap-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
        
        {/* Dashboard Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          
          {/* Logo & Brand name */}
          <div className="flex items-center gap-3 border border-white/[0.08] bg-white/[0.02] rounded-full px-5 py-2">
            <div className="w-5 h-5 rounded-md bg-[#EAB308] flex items-center justify-center text-[10px] font-semibold text-black">
              FM
            </div>
            <span className="font-mono text-sm font-semibold tracking-wider text-[#f7f8f8]">
              FirstMove
            </span>
          </div>

          {/* Navigation Pill tabs */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.04] rounded-full px-2 py-1 flex-wrap justify-center">
            {[
              { id: "Dashboard", label: "Dashboard" },
              { id: "Workspace", label: "AI Workspace" },
              { id: "AITools", label: "AI Tools" },
              { id: "Feedback", label: "Feedback" },
            ].map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "Dashboard") {
                      dispatch({ type: "RESET" });
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-[#8a8f98] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {/* Candidate selection dropdown */}
            <div className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.02] rounded-full px-4 py-1.5 text-xs font-medium text-[#d0d6e0] cursor-pointer hover:bg-white/[0.04] transition-colors">
              <span>Workspace</span>
              <span className="text-[10px] text-[#62666d]">▼</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.04] cursor-pointer transition-colors">
                🌙
              </button>
              <button className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.04] cursor-pointer transition-colors relative">
                🔔
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#EAB308]/60 flex-shrink-0 bg-neutral-800">
              <div className="w-full h-full bg-gradient-to-tr from-yellow-600 to-amber-300" />
            </div>
          </div>
        </div>

        {/* Inner Content Chassis */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
