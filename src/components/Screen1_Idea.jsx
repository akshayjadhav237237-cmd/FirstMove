import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { QuestionSkeleton } from "./SkeletonLoader";

export default function Screen1_Idea({ isLoading }) {
  const { state, dispatch } = useSession();
  const [ideaText, setIdeaText] = useState(state.rawIdea || "");

  // Clear local input if state resets
  useEffect(() => {
    if (state.currentState === "IDLE") {
      setIdeaText(state.rawIdea || "");
    }
  }, [state.currentState, state.rawIdea]);

  const starters = [
    "A platform to help college students find internships faster",
    "An app that gives affordable 3D tours of rental flats",
    "A tool that helps solo founders validate startup ideas",
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || isLoading) return;

    dispatch({ type: "SUBMIT_IDEA", payload: ideaText.trim() });

    try {
      const response = await resilientFetch(
        "/api/clarify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea: ideaText.trim() }),
        },
        ideaText.trim()
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.socratic_questions) {
        dispatch({
          type: "QUESTIONS_RECEIVED",
          payload: data.socratic_questions,
        });
      } else {
        throw new Error("Invalid response schema from Socratic advisor");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to generate questions. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base px-4 py-8 select-none">
      {/* TOP: Logo row */}
      <div className="flex items-center mb-12 animate-fade-in">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold mr-2 shadow-[0_0_15px_rgba(108,99,255,0.4)]">
          FM
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">FirstMove</span>
      </div>

      {isLoading ? (
        <div className="max-w-xl w-full">
          {/* Loading status text */}
          <div className="text-secondary text-sm text-center animate-pulse mb-8 font-medium">
            Thinking through your idea...
          </div>
          {/* Skeleton card replacing standard card content */}
          <div className="bg-card border border-white/8 rounded-2xl p-6 shadow-2xl">
            <QuestionSkeleton />
          </div>
        </div>
      ) : (
        <div className="max-w-xl w-full">
          {/* HEADLINE & SUBHEADLINE */}
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold tracking-tight mb-3">
              What's your idea?
            </h1>
            <p className="text-secondary text-sm font-medium">
              Messy is fine. We'll sharpen it together.
            </p>
          </div>

          {/* MAIN CARD */}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-white/8 rounded-2xl p-6 shadow-2xl w-full"
          >
            {/* Textarea */}
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Describe your idea in a sentence or two. It doesn't have to be perfect."
              className="w-full bg-input border border-white/8 rounded-xl p-4 text-white text-sm min-h-[120px] resize-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition"
              disabled={isLoading}
            />

            {/* Prompt starters */}
            <div className="flex gap-2 flex-wrap mt-4 mb-6">
              {starters.map((starter, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setIdeaText(starter)}
                  className="rounded-full border border-white/10 text-muted text-xs px-3 py-1.5 cursor-pointer hover:border-accent/30 hover:text-secondary transition text-left"
                  disabled={isLoading}
                >
                  {starter}
                </button>
              ))}
            </div>

            {/* Error Banner */}
            {state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">
                {state.error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!ideaText.trim() || isLoading}
              className={`w-full bg-accent hover:bg-accent-hover rounded-xl py-3 text-white font-medium transition flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(108,99,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>Sharpen My Idea →</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
