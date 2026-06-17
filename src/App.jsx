import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SessionProvider, useSession } from "./context/SessionContext";
import Screen1_Idea from "./screens/Screen1_Idea";
import Screen2_Questions from "./screens/Screen2_Questions";
import Screen3_Workspace from "./screens/Screen3_Workspace";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
};
const pageTransition = { duration: 0.25, ease: "easeOut" };

function AppRouter() {
  const { state } = useSession();
  const { currentState } = state;

  let screenKey = "s1";
  let ScreenComponent = null;

  if (currentState === "IDLE" || currentState === "PROCESSING_QUESTIONS") {
    screenKey = "screen1";
    ScreenComponent = (
      <Screen1_Idea isLoading={currentState === "PROCESSING_QUESTIONS"} />
    );
  } else if (currentState === "QUESTIONING" || currentState === "PROCESSING_ANALYSIS") {
    screenKey = "screen2";
    ScreenComponent = (
      <Screen2_Questions isLoading={currentState === "PROCESSING_ANALYSIS"} />
    );
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
        transition={pageTransition}
        style={{ height: "100%" }}
      >
        {ScreenComponent}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <div className="bg-base h-full text-white selection:bg-accent/30 selection:text-white">
        <AppRouter />
      </div>
    </SessionProvider>
  );
}
