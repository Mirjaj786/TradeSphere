import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useFlash } from "./Home";

const API_BASE_URL = "http://localhost:3002";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showFlash } = useFlash();
  const location = useLocation();

  // Use useMemo to prevent recreation on every render
  const menuItems = useMemo(() => [
    { label: "Dashboard", to: "/" },
    { label: "Orders", to: "/orders" },
    { label: "Holdings", to: "/holdings" },
    { label: "Positions", to: "/positions" },
    { label: "Funds", to: "/funds" },
    { label: "Apps", to: "/apps" },
  ], []); // Empty dependency array means this only gets created once

  // Auto-select menu based on current route
  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.to === location.pathname);
    if (currentIndex !== -1) {
      setSelectedMenu(currentIndex);
    }
  }, [location.pathname, menuItems]); // Now menuItems is stable between renders

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileDropdownOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setIsProfileDropdownOpen(false);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(` http://localhost:3002/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      try {
        localStorage.removeItem("user");
      } catch (e) {
        // Silent fail for localStorage
      }
      showFlash("success", "Logged out successfully");
      setTimeout(() => {
        window.location.href = `http://localhost:3000/signin`;
      }, 1000);
    } catch (err) {
      console.error("Logout failed", err);
      showFlash("error", "Logout failed. Please try again.");
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const userInitials = user?.username 
    ? user.username.slice(0, 2).toUpperCase() 
    : "ZU";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Logo" style={{ width: "50px" }} />

      <div className="menus">
        <ul>
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <Link
                style={{ textDecoration: "none" }}
                to={item.to}
                onClick={() => setSelectedMenu(idx)}
              >
                <p className={selectedMenu === idx ? activeMenuClass : menuClass}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <button
          className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <hr />

        {/* Profile */}
        <div className="profile" onClick={toggleProfileDropdown}>
          <div className="avatar small">
            {userInitials}
          </div>
          <p className="username">{user?.username || "USERID"}</p>

          {isProfileDropdownOpen && (
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="avatar large">
                  {userInitials}
                </div>
                <div className="profile-card-info">
                  <div className="name">{user?.username || "Guest"}</div>
                  <div className="email">{user?.email || ""}</div>
                </div>
              </div>
              <div className="profile-card-footer">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {menuItems.map((item, idx) => (
              <Link
                key={`m-${item.label}`}
                to={item.to}
                className="mobile-menu-item"
                onClick={() => {
                  setSelectedMenu(idx);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Menu);