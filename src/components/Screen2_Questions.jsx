import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { resilientFetch } from "../utils/resilientFetch";
import { BlueprintSkeleton } from "./SkeletonLoader";

export default function Screen2_Questions({ isLoading }) {
  const { state, dispatch } = useSession();
  const [answersMap, setAnswersMap] = useState(state.userAnswers || {});

  const handleAnswerChange = (questionId, val) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const isFormValid =
    state.socraticQuestions.length > 0 &&
    state.socraticQuestions.every(
      (q) => answersMap[q.id] && answersMap[q.id].trim().length > 0
    );

  const handleSubmitAnswers = async (e) => {
    if (e) e.preventDefault();
    if (!isFormValid || isLoading) return;

    // Build qa array: question_text and answer
    const qa = state.socraticQuestions.map((q) => ({
      question_text: q.question_text,
      answer: answersMap[q.id] || "",
    }));

    dispatch({ type: "SUBMIT_ANSWERS", payload: answersMap });

    try {
      const response = await resilientFetch(
        "/api/blueprint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idea: state.rawIdea,
            qa,
          }),
        },
        state.rawIdea
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch({ type: "PLAN_RECEIVED", payload: data });
    } catch (err) {
      console.error("Error generating blueprint:", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to build blueprint. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 select-none min-h-screen flex flex-col">
      {/* BACK BUTTON */}
      <div className="mb-8 self-start">
        <button
          onClick={handleReset}
          className="text-secondary text-sm cursor-pointer hover:text-white transition font-medium"
        >
          ← Start over
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col">
          {/* Loading status text */}
          <div className="text-secondary text-sm animate-pulse mb-8 font-medium">
            Building your de-risked plan...
          </div>
          {/* Blueprint Skeleton Loader */}
          <BlueprintSkeleton />
        </div>
      ) : (
        <form onSubmit={handleSubmitAnswers} className="flex-1 flex flex-col">
          {/* STEP TAG */}
          <div className="mb-4">
            <span className="bg-accent/10 text-accent text-xs rounded-full px-3 py-1 inline-block font-semibold">
              Step 2 of 3
            </span>
          </div>

          {/* HEADINGS */}
          <div className="mb-8">
            <h1 className="text-white text-2xl font-semibold mb-2">
              A few quick questions
            </h1>
            <p className="text-secondary text-sm font-normal">
              Your answers shape the quality of your plan.
            </p>
          </div>

          {/* Socratic Questions Mapping */}
          <div className="space-y-4 mb-6">
            {state.socraticQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-card border border-white/8 rounded-xl p-5 shadow-lg flex flex-col"
              >
                {/* Target Variable Label */}
                <span className="text-muted text-[10px] uppercase tracking-wider font-semibold">
                  {q.target_variable || "UNKNOWN"}
                </span>

                {/* Question Text */}
                <h2 className="text-white text-base font-medium mt-2 mb-1">
                  {q.question_text}
                </h2>

                {/* Rationale */}
                <p className="text-muted text-xs italic mb-3">
                  {q.contextual_rationale}
                </p>

                {/* Answer Area */}
                <textarea
                  value={answersMap[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Your answer..."
                  className="w-full bg-input border border-white/8 rounded-lg p-3 text-white text-sm min-h-[80px] resize-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition"
                  disabled={isLoading}
                />
              </div>
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
            disabled={!isFormValid || isLoading}
            className="w-full bg-accent hover:bg-accent-hover rounded-xl py-3 text-white font-medium transition flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(108,99,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            <span>Build My Plan →</span>
          </button>
        </form>
      )}
    </div>
  );
}
