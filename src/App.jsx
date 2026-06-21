import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SessionProvider, useSession } from "./context/SessionContext";
import LandingPage from "./screens/LandingPage";
import Screen1_Idea from "./screens/Screen1_Idea";
import Screen2_Questions from "./screens/Screen2_Questions";
import Screen3_Workspace from "./screens/Screen3_Workspace";

const gentleSpring = { type: "spring", stiffness: 450, damping: 32, mass: 1 };

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

function AppRouter() {
  const { state } = useSession();
  const { currentState } = state;
  const [showLanding, setShowLanding] = useState(true);

  // Sync landing visibility on reset
  useEffect(() => {
    if (currentState === "IDLE" && !state.rawIdea) {
      setShowLanding(true);
    }
  }, [currentState, state.rawIdea]);

  let screenKey = "s1";
  let ScreenComponent = null;

  if (currentState === "IDLE" || currentState === "PROCESSING_QUESTIONS") {
    if (currentState === "IDLE" && showLanding) {
      screenKey = "landing";
      ScreenComponent = <LandingPage onStart={() => setShowLanding(false)} />;
    } else {
      screenKey = "screen1";
      ScreenComponent = <Screen1_Idea isLoading={currentState === "PROCESSING_QUESTIONS"} />;
    }
  } else if (currentState === "QUESTIONING" || currentState === "PROCESSING_ANALYSIS") {
    screenKey = "screen2";
    ScreenComponent = <Screen2_Questions isLoading={currentState === "PROCESSING_ANALYSIS"} />;
  } else if (currentState === "ANALYSIS_COMPLETE") {
    screenKey = "screen3";
    ScreenComponent = <Screen3_Workspace />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={gentleSpring}
        style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", flex: 1 }}
      >
        {ScreenComponent}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <div className="relative min-h-screen w-screen bg-[#080C14] text-[#F1F5F9] overflow-hidden select-none font-sans">
        
        {/* Main Content Viewport */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <AppRouter />
        </div>

      </div>
    </SessionProvider>
  );
}
