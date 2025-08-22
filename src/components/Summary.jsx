import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useFlash } from "./Home";

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
  const { showFlash } = useFlash();
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3002/auth/me", {
          withCredentials: true,
        });

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          showFlash("success", `Welcome back, ${res.data.user.username}!`);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null); // user not logged in
        } else {
          console.error("Failed to fetch user:", error);
          showFlash("error", "Failed to load user data");
        }
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // removed showFlash from deps to prevent unnecessary loops

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
          onClick={() => (window.location.href = "http://localhost:3002/auth/login")}
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

export default Summary;
