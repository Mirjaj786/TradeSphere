import React, { useEffect, useState, createContext, useContext, useCallback, useMemo } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Flash from "./Flash";

// Create Flash Context
export const FlashContext = createContext();

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
};

const Home = () => {
  const [flashSuccess, setFlashSuccess] = useState("");
  const [flashError, setFlashError] = useState("");

  const showFlash = useCallback((type, message, duration = 3000) => {
    if (type === "success") {
      setFlashSuccess(message);
      const timer = setTimeout(() => setFlashSuccess(""), duration);
      return () => clearTimeout(timer);
    } else if (type === "error") {
      setFlashError(message);
      const timer = setTimeout(() => setFlashError(""), duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const clearFlash = useCallback((type) => {
    if (type === "success") setFlashSuccess("");
    else if (type === "error") setFlashError("");
  }, []);

  // Load flash messages from localStorage once on mount
  useEffect(() => {
    const msg = localStorage.getItem("flash_success");
    let timer;
    if (msg) {
      setFlashSuccess(msg);
      localStorage.removeItem("flash_success");
      timer = setTimeout(() => setFlashSuccess(""), 3000);
    }
    return () => clearTimeout(timer);
  }, []);

  const providerValue = useMemo(() => ({ showFlash, clearFlash }), [showFlash, clearFlash]);

  return (
    <FlashContext.Provider value={providerValue}>
      {flashSuccess && <Flash success={flashSuccess} />}
      {flashError && <Flash error={flashError} />}
      <TopBar />
      <Dashboard />
    </FlashContext.Provider>
  );
};

export default Home;
