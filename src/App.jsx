import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { SessionProvider, useSession } from "./context/SessionContext";
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

  let screenKey = "s1";
  let ScreenComponent = null;

  if (currentState === "IDLE" || currentState === "PROCESSING_QUESTIONS") {
    screenKey = "screen1";
    ScreenComponent = <Screen1_Idea isLoading={currentState === "PROCESSING_QUESTIONS"} />;
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
      <div className="relative min-h-screen w-screen bg-[#0d021a] text-[#f7f8f8] overflow-hidden select-none font-sans">
        
        {/* Synthwave Backdrops */}
        <div className="synthwave-grid" />
        <div className="synthwave-sunset" />

        {/* Content sits above overlays */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <AppRouter />
        </div>

      </div>
    </SessionProvider>
  );
}
