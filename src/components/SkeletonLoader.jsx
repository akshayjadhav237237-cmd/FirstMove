import React from "react";

export function QuestionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="synthwave-panel p-5">
          <div className="synthwave-shimmer-block h-2.5 w-28 mb-3" />
          <div className="synthwave-shimmer-block h-3.5 w-full mb-2" />
          <div className="synthwave-shimmer-block h-3.5 w-4/5 mb-4" />
          <div className="synthwave-shimmer-block h-[90px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function AgentSkeleton() {
  return (
    <div className="synthwave-panel overflow-hidden mb-4">
      <div className="h-10 px-4 flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-2.5">
          <div className="synthwave-shimmer-block w-3 h-3 rounded-sm" />
          <div className="synthwave-shimmer-block h-2.5 w-24 rounded" />
        </div>
        <div className="synthwave-shimmer-block h-5 w-14 rounded-full" />
      </div>
      <div className="p-4 space-y-2">
        <div className="synthwave-shimmer-block h-2.5 w-20 mb-3 rounded" />
        <div className="synthwave-shimmer-block h-3 w-full rounded" />
        <div className="synthwave-shimmer-block h-3 w-5/6 rounded" />
        <div className="synthwave-shimmer-block h-3 w-4/5 rounded" />
      </div>
    </div>
  );
}

export function ScenarioSkeleton() {
  return (
    <div className="synthwave-panel p-4 mb-3 border-l-2 border-l-[#ff007f]">
      <div className="flex justify-between items-center mb-2">
        <div className="synthwave-shimmer-block h-2.5 w-28 rounded" />
        <div className="synthwave-shimmer-block h-2.5 w-16 rounded" />
      </div>
      <div className="synthwave-shimmer-block h-3.5 w-full mb-3 rounded" />
      <div className="space-y-1.5 mb-3">
        <div className="synthwave-shimmer-block h-2.5 w-full rounded" />
        <div className="synthwave-shimmer-block h-2.5 w-4/5 rounded" />
      </div>
      <div className="border-t border-white/[0.04] pt-3 flex justify-between">
        <div className="synthwave-shimmer-block h-2 w-32 rounded" />
        <div className="synthwave-shimmer-block h-1.5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function BlueprintSkeleton() {
  return (
    <div className="space-y-4">
      <div className="synthwave-shimmer-block h-20 w-full rounded-lg" />
      <div className="synthwave-shimmer-block h-32 w-full rounded-lg" />
      <div className="synthwave-shimmer-block h-24 w-full rounded-lg" />
    </div>
  );
}
