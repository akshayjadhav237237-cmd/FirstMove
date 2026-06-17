import React, { createContext, useReducer, useEffect, useContext } from "react";

const initialState = {
  currentState: "IDLE",
  rawIdea: "",
  socraticQuestions: [],
  userAnswers: {},
  debate: null,
  blueprint: null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SUBMIT_IDEA":
      return {
        ...state,
        currentState: "PROCESSING_QUESTIONS",
        rawIdea: action.payload,
        error: null,
      };
    case "QUESTIONS_RECEIVED":
      return {
        ...state,
        currentState: "QUESTIONING",
        socraticQuestions: action.payload,
      };
    case "SUBMIT_ANSWERS":
      return {
        ...state,
        currentState: "PROCESSING_ANALYSIS",
        userAnswers: action.payload,
        error: null,
      };
    case "ANALYSIS_COMPLETE":
      return {
        ...state,
        currentState: "ANALYSIS_COMPLETE",
        debate: action.payload.debate,
        blueprint: action.payload.blueprint,
      };
    case "SET_ERROR":
      return {
        ...state,
        currentState:
          state.currentState === "PROCESSING_QUESTIONS" ? "IDLE" : "QUESTIONING",
        error: action.payload,
      };
    case "RESET":
      sessionStorage.removeItem("firstmove_session");
      return initialState;
    default:
      return state;
  }
}

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = sessionStorage.getItem("firstmove_session");
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("firstmove_session", JSON.stringify(state));
  }, [state]);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
