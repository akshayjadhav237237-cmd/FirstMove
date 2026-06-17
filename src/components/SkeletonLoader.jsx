import React from "react";

export function QuestionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-white/8 rounded-xl p-5">
          <div className="skeleton-shimmer h-3 w-28 mb-3 rounded" />
          <div className="skeleton-shimmer h-4 w-full mb-2 rounded" />
          <div className="skeleton-shimmer h-4 w-4/5 mb-4 rounded" />
          <div className="skeleton-shimmer h-[90px] w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export function AgentSkeleton() {
  return (
    <div className="bg-card border border-white/8 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer w-2 h-2 rounded-full" />
          <div className="skeleton-shimmer h-3 w-24 rounded" />
        </div>
        <div className="skeleton-shimmer h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-3 w-20 mb-4 rounded" />
      <div className="skeleton-shimmer h-16 w-full rounded mb-3" />
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="skeleton-shimmer h-3 w-5/6 rounded" />
        <div className="skeleton-shimmer h-3 w-4/6 rounded" />
      </div>
    </div>
  );
}

export function ScenarioSkeleton() {
  return (
    <div className="bg-card border border-white/8 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="skeleton-shimmer h-4 w-28 rounded" />
        <div className="skeleton-shimmer h-4 w-16 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-4 w-full rounded mb-3" />
      <div className="space-y-1.5 mb-3">
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="skeleton-shimmer h-3 w-4/5 rounded" />
      </div>
      <div className="skeleton-shimmer h-1.5 w-full rounded-full" />
    </div>
  );
}

export function BlueprintSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton-shimmer h-24 w-full rounded-xl" />
      <div className="skeleton-shimmer h-36 w-full rounded-xl" />
      <div className="skeleton-shimmer h-28 w-full rounded-xl" />
    </div>
  );
}
