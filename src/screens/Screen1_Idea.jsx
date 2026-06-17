import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "../components/SkeletonLoader";

const CHIPS = [
  "An app that gives affordable 3D tours of rental flats in Pune",
  "A platform to help college students find internships faster",
  "A tool for solo founders to validate startup ideas quickly",
];

export default function Screen1_Idea({ isLoading }) {
  const { state, dispatch } = useSession();
  const [idea, setIdea] = useState(state.rawIdea || "");

  const handleSubmit = async () => {
    if (!idea.trim() || isLoading) return;
    const trimmed = idea.trim();
    dispatch({ type: "SUBMIT_IDEA", payload: trimmed });
    try {
      const res = await resilientFetch(
        "/api/clarify",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: trimmed }) },
        trimmed
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      dispatch({ type: "QUESTIONS_RECEIVED", payload: data.socratic_questions });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to generate questions. Please try again." });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base px-4 overflow-auto py-12">
      {/* Logo row */}
      <div className="flex items-center gap-3 mb-16">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(108,99,255,0.4)]">
          FM
        </div>
        <span className="text-white font-semibold text-xl tracking-tight">FirstMove</span>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <span className="text-muted text-xs bg-white/5 px-3 py-1 rounded-full">
          Multi-Agent Decision Intelligence
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-white text-5xl font-bold tracking-tight text-center mb-4">
        What's your idea?
      </h1>
      <p className="text-secondary text-lg text-center mb-12">
        Three AI agents will debate it. You'll get a de-risked plan.
      </p>

      {/* Main card */}
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-white/8 rounded-2xl p-8 card-top-glow">
          {isLoading ? (
            <div>
              <p className="text-secondary text-sm text-center animate-pulse mb-6 font-medium">
                Analyzing your idea...
              </p>
              <QuestionSkeleton />
            </div>
          ) : (
            <>
              {/* Textarea */}
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your idea in a sentence or two..."
                className="w-full bg-input-bg border border-white/8 rounded-xl p-5 text-white text-base min-h-[140px] resize-none placeholder:text-muted/60 leading-relaxed transition-all duration-150"
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
              />

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-5 mb-6">
                {CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdea(chip)}
                    className="border border-white/8 rounded-full text-muted text-sm px-4 py-2 cursor-pointer hover:border-accent/30 hover:text-white/70 hover:bg-accent/5 transition-all duration-200 text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Error */}
              {state.error && (
                <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-4 text-red-400 text-sm mb-4">
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || isLoading}
                className="w-full rounded-xl py-4 font-semibold text-base mt-2 bg-accent hover:bg-accent-hover text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(108,99,255,0.25)]"
              >
                Sharpen My Idea →
              </button>
            </>
          )}
        </div>

        {/* Bottom hint */}
        <p className="mt-8 text-center text-muted text-xs">
          Strategist · Risk Analyst · Devil's Advocate — three perspectives, one clear plan.
        </p>
      </div>
    </div>
  );
}
