import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Flash from "./Flash";

const Home = () => {
  const [flashSuccess, setFlashSuccess] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("flash_success");
    if (msg) {
      setFlashSuccess(msg);
      localStorage.removeItem("flash_success");
    }
  }, []);
  return (
    <>
      {flashSuccess && <Flash success={flashSuccess} />}
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;