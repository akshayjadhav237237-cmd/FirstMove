import React from "react";

export function QuestionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="terminal-panel p-5">
          <div className="terminal-pulse-block h-2.5 w-28 mb-3" />
          <div className="terminal-pulse-block h-3.5 w-full mb-2" />
          <div className="terminal-pulse-block h-3.5 w-4/5 mb-4" />
          <div className="terminal-pulse-block h-[90px] w-full" />
        </div>
      ))}
    </div>
  );
}

export function AgentSkeleton() {
  return (
    <div className="terminal-panel overflow-hidden mb-4">
      <div className="h-10 px-4 flex items-center justify-between border-b border-[#1b4d1b] bg-[#0a1a0a]">
        <div className="flex items-center gap-2.5">
          <div className="terminal-pulse-block w-3 h-3" />
          <div className="terminal-pulse-block h-2.5 w-24" />
        </div>
        <div className="terminal-pulse-block h-5 w-14" />
      </div>
      <div className="p-4 space-y-2">
        <div className="terminal-pulse-block h-2.5 w-20 mb-3" />
        <div className="terminal-pulse-block h-3 w-full" />
        <div className="terminal-pulse-block h-3 w-5/6" />
        <div className="terminal-pulse-block h-3 w-4/5" />
      </div>
    </div>
  );
}

export function ScenarioSkeleton() {
  return (
    <div className="terminal-panel p-4 mb-3 border-l-2 border-l-[#33ff33]">
      <div className="flex justify-between items-center mb-2">
        <div className="terminal-pulse-block h-2.5 w-28" />
        <div className="terminal-pulse-block h-2.5 w-16" />
      </div>
      <div className="terminal-pulse-block h-3.5 w-full mb-3" />
      <div className="space-y-1.5 mb-3">
        <div className="terminal-pulse-block h-2.5 w-full" />
        <div className="terminal-pulse-block h-2.5 w-4/5" />
      </div>
      <div className="border-t border-[#1b4d1b] pt-3 flex justify-between">
        <div className="terminal-pulse-block h-2 w-32" />
        <div className="terminal-pulse-block h-1.5 w-16" />
      </div>
    </div>
  );
}

export function BlueprintSkeleton() {
  return (
    <div className="space-y-4">
      <div className="terminal-pulse-block h-20 w-full" />
      <div className="terminal-pulse-block h-32 w-full" />
      <div className="terminal-pulse-block h-24 w-full" />
    </div>
  );
}
