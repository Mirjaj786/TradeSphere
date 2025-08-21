import React, { useEffect, useState } from "react";

export default function Flash({ success = "", error = "", duration = 3000 }) {
  const [visible, setVisible] = useState(Boolean(success || error));

  useEffect(() => {
    setVisible(Boolean(success || error));
    if (success || error) {
      const timerId = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timerId);
    }
  }, [success, error, duration]);

  if (!visible) return null;

  const isSuccess = Boolean(success);
  const message = isSuccess ? success : error;
  const bg = isSuccess ? "#16a34a" : "#dc2626";
  const border = isSuccess ? "#14532d" : "#7f1d1d";

  return (
    <div role="status" aria-live="polite" className="flash-container">
      <div className={`flash-message ${isSuccess ? "flash-success" : "flash-error"}`}>
        <span>{message}</span>
        <button aria-label="Close" onClick={() => setVisible(false)} className="flash-close">×</button>
      </div>
    </div>
  );
}


