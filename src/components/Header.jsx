import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import govLogo from "../assets/logo.png";
import { Bell, User, ChevronDown, Menu } from "lucide-react";
import "../css/Header.css";

const Header = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="dashboard-header shadow-3d rounded-3d">
      <div className="header-left d-flex align-items-center gap-3">
        <button className="menu-toggle-btn d-lg-none" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <img src={govLogo} alt="Logo" className="rounded-circle bg-white p-1" width={42} height={42} />        
      </div>

      <div className="header-right d-flex align-items-center gap-4">
        <div className="icon-btn position-relative">
          <Bell size={22} className="text-light" />
          <span className="notification-dot"></span>
        </div>

        <div className="profile-dropdown" onClick={() => setShowMenu(!showMenu)}>
          <div className="d-flex align-items-center gap-2">
            <User size={24} className="text-light" />
            <span className="fw-semibold text-white d-none d-md-inline">Admin</span>
            <ChevronDown size={16} className="text-light d-none d-md-inline dropdown-icon" />
          </div>

          {showMenu && (
            <div className="dropdown-menu-profile shadow-3d rounded-3d">
              <div className="dropdown-item" onClick={() => navigate("/my-profile")}>My Profile</div>
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-item text-danger fw-semibold" onClick={() => { logout(); navigate("/login"); }}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
