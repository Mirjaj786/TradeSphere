import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useFlash } from "./Home";

// Use environment variable or default to localhost:3002
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

const Summary = () => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { showFlash } = useFlash();
  const fetchingRef = useRef(false);

  const fetchUser = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);
      setConnectionError(false);
      
      console.log(`Attempting to fetch user from: ${API_BASE_URL}/auth/me`);
      
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
        timeout: 5000, // 5 second timeout
      });

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        showFlash("success", `Welcome back, ${res.data.user.username}!`);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        setConnectionError(true);
        showFlash("error", "Cannot connect to server. Please check if the backend is running.");
      } else if (error.response?.status === 401) {
        setUser(null); // user not logged in
      } else {
        showFlash("error", "Failed to load user data");
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [showFlash]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLoginRedirect = () => {
    window.location.href = `http://localhost:3000/signin`;
  };

  const handleRetry = () => {
    fetchUser();
  };

  if (connectionError) {
    return (
      <div className="username">
        <h6>Connection Error</h6>
        <p>Cannot connect to the server at {API_BASE_URL}</p>
        <button onClick={handleRetry} className="btn btn-primary">
          Retry Connection
        </button>
        <hr className="divider" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="username">
        <h6>Loading...</h6>
        <hr className="divider" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="username">
        <h6>You are not logged in</h6>
        <button
          onClick={handleLoginRedirect}
          className="btn btn-primary"
        >
          Login
        </button>
        <hr className="divider" />
      </div>
    );
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {user.username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance <span>3.74k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>
            </p>
            <p>
              Investment <span>29.88k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default React.memo(Summary);