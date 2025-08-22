import React, { useEffect, useState } from "react";

export default function Flash({ success = "", error = "", duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (success || error) {
      setVisible(true);
      const timerId = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timerId);
    } else {
      setVisible(false);
    }
  }, [success, error, duration]);

  if (!visible || (!success && !error)) return null;

  const isSuccess = Boolean(success);
  const message = isSuccess ? success : error;

  return (
    <div role="status" aria-live="polite" className="flash-container">
      <div
        className={`flash-message ${isSuccess ? "flash-success" : "flash-error"}`}
      >
        <span>{message}</span>
        <button
          aria-label="Close"
          onClick={() => setVisible(false)}
          className="flash-close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
