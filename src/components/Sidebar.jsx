import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "../services/menuService";
import { getUserProfile, getUserRoles } from "../services/dashboardService";
import defaultAvatar from "../assets/avatar.png";
import "../css/Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState({});
  const location = useLocation();
  const sidebarRef = useRef(null);
  const roles = getUserRoles() || [];

  const visibleMenus = menuItems.filter((item) =>
    item.roles.some((r) => roles.includes(r))
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch {
        console.warn("Profile fetch failed");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (window.innerWidth <= 992) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setIsOpen]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`sidebar shadow-3d rounded-3d ${isOpen ? "open" : "closed"}`}
      >
        {/* Profile Section */}
        <div className="sidebar-profile text-center">
          <img
            src={user.profileImageUrl || defaultAvatar}
            alt="User Avatar"
            className="rounded-circle border border-light mb-2 shadow-sm"
            width="90"
            height="90"
          />
          <h6 className="fw-semibold mt-2 mb-0" style={{ color: "#f1f1f1" }}>
            {user?.fullName || "Super Admin"}
          </h6>
          <p className="mb-1 small" style={{ color: "#cfd8dc" }}>
            {user?.role || "Administrator"}
          </p>
          <Link
            to="/my-profile"
            className="small text-decoration-none"
            style={{ color: "#a8c0ff", opacity: 0.8 }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#b0d6ff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#a8c0ff")}
          >
            View Profile
          </Link>
        </div>

        <hr className="sidebar-divider" />

        {/* Menu Links */}
        <ul className="nav flex-column">
          {visibleMenus.map((item, i) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={i} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center ${active ? "active-link" : ""}`}
                >
                  {Icon && <Icon size={18} className="me-2" />}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 992 && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
