import React, { useEffect, useState, createContext, useContext } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Flash from "./Flash";

// Create Flash Context
export const FlashContext = createContext();

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

const Home = () => {
  const [flashSuccess, setFlashSuccess] = useState("");
  const [flashError, setFlashError] = useState("");

  const showFlash = (type, message, duration = 3000) => {
    if (type === 'success') {
      setFlashSuccess(message);
      setTimeout(() => setFlashSuccess(""), duration);
    } else if (type === 'error') {
      setFlashError(message);
      setTimeout(() => setFlashError(""), duration);
    }
  };

  const clearFlash = (type) => {
    if (type === 'success') setFlashSuccess("");
    else if (type === 'error') setFlashError("");
  };

  useEffect(() => {
    const msg = localStorage.getItem("flash_success");
    if (msg) {
      showFlash('success', msg);
      localStorage.removeItem("flash_success");
    }
  }, []);

  return (
    <FlashContext.Provider value={{ showFlash, clearFlash }}>
      {flashSuccess && <Flash success={flashSuccess} />}
      {flashError && <Flash error={flashError} />}
      <TopBar />
      <Dashboard />
    </FlashContext.Provider>
  );
};

export default Home;