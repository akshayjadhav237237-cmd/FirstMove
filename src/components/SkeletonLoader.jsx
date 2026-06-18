import React from "react";

export function QuestionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#0D1220] border border-white/[0.07] rounded-xl p-5">
          <div className="bento-pulse h-2.5 w-28 mb-3 rounded" />
          <div className="bento-pulse h-3.5 w-full mb-2 rounded" />
          <div className="bento-pulse h-3.5 w-4/5 mb-4 rounded" />
          <div className="bento-pulse h-[72px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function AgentSkeleton() {
  return (
    <div className="bg-[#0D1220] border border-white/[0.07] rounded-xl overflow-hidden mb-4">
      <div className="h-10 px-4 flex items-center justify-between border-b border-white/[0.07] bg-white/[0.01]">
        <div className="flex items-center gap-2.5">
          <div className="bento-pulse w-3 h-3 rounded-sm" />
          <div className="bento-pulse h-2.5 w-24 rounded" />
        </div>
        <div className="bento-pulse h-5 w-14 rounded-full" />
      </div>
      <div className="p-4 space-y-2">
        <div className="bento-pulse h-2.5 w-20 mb-3 rounded" />
        <div className="bento-pulse h-3 w-full rounded" />
        <div className="bento-pulse h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function ScenarioSkeleton() {
  return (
    <div className="bg-[#0D1220] border border-white/[0.07] rounded-xl p-4 mb-3 border-l-[3px] border-l-white/10">
      <div className="flex justify-between items-center mb-2">
        <div className="bento-pulse h-2.5 w-28 rounded" />
        <div className="bento-pulse h-2.5 w-16 rounded" />
      </div>
      <div className="bento-pulse h-3.5 w-full mb-3 rounded" />
      <div className="space-y-1.5 mb-3">
        <div className="bento-pulse h-2.5 w-full rounded" />
        <div className="bento-pulse h-2.5 w-4/5 rounded" />
      </div>
      <div className="border-t border-white/[0.07] pt-3 flex justify-between">
        <div className="bento-pulse h-2 w-32 rounded" />
        <div className="bento-pulse h-1.5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function BlueprintSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bento-pulse h-20 w-full rounded-xl" />
      <div className="bento-pulse h-32 w-full rounded-xl" />
      <div className="bento-pulse h-24 w-full rounded-xl" />
    </div>
  );
}
