import React, { useState } from "react";
import ConfidenceBadge from "./ConfidenceBadge";

export default function AssumptionCard({ assumption }) {
  const [view, setView] = useState("collapsed"); // 'collapsed' | 'expanded' | 'tested'

  const { id, dimension, assumption_statement, confidence_assessment } = assumption;
  const { confidence_score, qualitative_label, contributing_factors } = confidence_assessment;

  // Format dimension to Title Case (e.g. Desirability)
  const formattedDimension =
    dimension.charAt(0).toUpperCase() + dimension.slice(1).toLowerCase();

  // DVF Badge Styles based on dimension
  let dvfBadgeStyle = "";
  if (dimension === "DESIRABILITY") {
    dvfBadgeStyle = "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";
  } else if (dimension === "VIABILITY") {
    dvfBadgeStyle = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  } else if (dimension === "FEASIBILITY") {
    dvfBadgeStyle = "bg-orange-500/15 text-orange-400 border border-orange-500/30";
  }

  if (view === "collapsed") {
    return (
      <div
        onClick={() => setView("expanded")}
        className="bg-card border border-white/8 rounded-xl p-4 mb-3 cursor-pointer hover:border-white/15 transition flex flex-col justify-between"
      >
        <div className="flex justify-between items-center mb-2">
          <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${dvfBadgeStyle}`}>
            {formattedDimension}
          </span>
          <ConfidenceBadge score={confidence_score} label={qualitative_label} />
        </div>
        <p className="text-white text-sm mt-1 mb-2 leading-relaxed font-normal">
          {assumption_statement}
        </p>
        <span className="text-muted text-xs">
          Tap to see how to test this ↓
        </span>
      </div>
    );
  }

  if (view === "expanded") {
    return (
      <div className="bg-card border border-white/8 rounded-xl p-4 mb-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${dvfBadgeStyle}`}>
            {formattedDimension}
          </span>
          <ConfidenceBadge score={confidence_score} label={qualitative_label} />
        </div>
        <p className="text-white text-sm mt-1 mb-2 leading-relaxed font-normal">
          {assumption_statement}
        </p>

        <div className="mt-3 mb-3">
          <span className="text-secondary text-xs block font-medium">
            Confidence: {confidence_score}/100
          </span>
        </div>

        {/* Contributing factors */}
        <div className="bg-input rounded-lg p-3 mb-3">
          <span className="text-muted text-xs block mb-2 font-medium">Why this score:</span>
          <div className="space-y-1">
            {contributing_factors.map((factor, index) => (
              <p key={index} className="text-secondary text-xs mb-1">
                • {factor}
              </p>
            ))}
          </div>
        </div>

        {/* Mom Test block */}
        <div className="bg-input rounded-lg p-3 mb-3">
          <span className="text-muted text-xs block mb-1 font-medium">How to test this:</span>
          <p className="text-white text-xs leading-relaxed">
            Talk to 3 real people. Ask them: "Walk me through the last time you faced this problem. What did you do about it?"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("collapsed")}
            className="flex-1 border border-white/10 rounded-lg py-2 text-xs text-muted hover:text-secondary font-medium transition"
          >
            ↑ Collapse
          </button>
          <button
            onClick={() => setView("tested")}
            className="flex-1 border border-emerald-500/30 rounded-lg py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 font-medium transition"
          >
            Mark as Tested ✓
          </button>
        </div>
      </div>
    );
  }

  if (view === "tested") {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 mb-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${dvfBadgeStyle}`}>
            {formattedDimension}
          </span>
          <ConfidenceBadge score={confidence_score} label={qualitative_label} />
        </div>
        <p className="line-through text-muted text-sm mt-1 mb-2 leading-relaxed">
          {assumption_statement}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-emerald-400 text-xs font-medium">✓ Tested</span>
          <button
            onClick={() => setView("collapsed")}
            className="text-muted text-xs underline cursor-pointer hover:text-secondary transition"
          >
            Untested
          </button>
        </div>
      </div>
    );
  }

  return null;
}
