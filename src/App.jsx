import React from "react";
import { SessionProvider, useSession } from "./context/SessionContext";
import Screen1_Idea from "./components/Screen1_Idea";
import Screen2_Questions from "./components/Screen2_Questions";
import Screen3_Blueprint from "./components/Screen3_Blueprint";

function AppContent() {
  const { state } = useSession();
  const { currentState } = state;

  switch (currentState) {
    case "IDLE":
      return <Screen1_Idea isLoading={false} />;
    case "PROCESSING_QUESTIONS":
      return <Screen1_Idea isLoading={true} />;
    case "QUESTIONING":
      return <Screen2_Questions isLoading={false} />;
    case "PROCESSING_PLAN":
      return <Screen2_Questions isLoading={true} />;
    case "PLAN_GENERATED":
      return <Screen3_Blueprint />;
    default:
      return <Screen1_Idea isLoading={false} />;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <div className="bg-base min-h-screen text-white selection:bg-accent/30 selection:text-white">
        <AppContent />
      </div>
    </SessionProvider>
  );
}
