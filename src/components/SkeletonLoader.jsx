import React from "react";

export function QuestionSkeleton() {
  return (
    <div className="w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-white/8 rounded-xl p-5 mb-4">
          <div className="skeleton-shimmer h-3 w-24 mb-4 rounded-lg"></div>
          <div className="skeleton-shimmer h-4 w-full mb-2 rounded-lg"></div>
          <div className="skeleton-shimmer h-4 w-3/4 mb-4 rounded-lg"></div>
          <div className="skeleton-shimmer h-16 w-full rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

export function BlueprintSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="skeleton-shimmer h-20 w-full rounded-xl"></div>
      <div className="skeleton-shimmer h-32 w-full rounded-xl"></div>
      <div className="skeleton-shimmer h-28 w-full rounded-xl"></div>
      <div className="skeleton-shimmer h-24 w-full rounded-xl"></div>
    </div>
  );
}
