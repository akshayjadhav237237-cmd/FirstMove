import React from "react";

const radius = 12;
const circumference = 2 * Math.PI * radius;

export default function ConfidenceRing({ score }) {
  const s = typeof score === "number" ? score : 0;
  const offset = circumference - (s / 100) * circumference;
  const color = s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16" cy="16" r={radius}
          className="fill-none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        <circle
          cx="16" cy="16" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
      <span className="absolute text-[9px] font-mono font-semibold text-[#f7f8f8]">
        {s}
      </span>
    </div>
  );
}
