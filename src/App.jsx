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
      <div className="relative min-h-screen w-screen bg-[#080710] text-[#E2E8F0] overflow-hidden select-none font-sans">
        
        {/* Top center spotlight */}
        <div 
          className="absolute w-full h-[400px] -top-[150px] left-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, transparent 60%)",
            zIndex: 0
          }}
        />

        {/* Content above the spotlight */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <AppRouter />
        </div>

      </div>
    </SessionProvider>
  );
}
