import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFlash } from "./Home";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showFlash } = useFlash();

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  // Fetch current logged-in user
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3002/auth/me", {
          withCredentials: true,
        });
        if (isMounted) setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (isMounted) setUser(null);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      showFlash("success", "Logged out successfully");
      setTimeout(() => {
        window.location.href = "http://localhost:3000/signin";
      }, 1000);
    } catch (err) {
      console.error("Logout failed", err);
      showFlash("error", "Logout failed. Please try again.");
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const menuItems = [
    { label: "Dashboard", to: "/" },
    { label: "Orders", to: "/orders" },
    { label: "Holdings", to: "/holdings" },
    { label: "Positions", to: "/positions" },
    { label: "Funds", to: "/funds" },
    { label: "Apps", to: "/apps" },
  ];

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
          aria-label="Open menu"
          onClick={toggleMobileMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar small">
            {user?.username
              ? user.username.slice(0, 2).toUpperCase()
              : "ZU"}
          </div>
          <p className="username">{user?.username || "Guest"}</p>
          {isProfileDropdownOpen && (
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="avatar large">
                  {user?.username
                    ? user.username.slice(0, 2).toUpperCase()
                    : "ZU"}
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

export default Menu;
