import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserProfile, getUserRoles } from "../services/dashboardService";
import { menuItems } from "../services/menuService";
import defaultAvatar from "../assets/avatar.png";

const Sidebar = () => {
  const [user, setUser] = useState({});
  const [isOpen, setIsOpen] = useState(window.innerWidth > 992);
  const location = useLocation();
  const roles = getUserRoles() || [];

  // Load user profile and handle window resize
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    loadProfile();

    const handleResize = () => setIsOpen(window.innerWidth > 992);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter menus based on user roles
  const visibleMenus = menuItems.filter((item) =>
    item.roles.some((r) => roles.includes(r))
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="btn btn-primary d-lg-none position-fixed top-0 start-0 m-2 z-3"
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar shadow-lg text-white d-flex flex-column p-3 position-fixed top-0 start-0 vh-100 ${
          isOpen ? "open" : "closed"
        }`}
        style={{
          width: "240px",
          background: "linear-gradient(180deg, #002147 0%, #004b8d 100%)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          zIndex: 1050,
        }}
      >
        {/* User Info */}
        <div className="text-center mb-4">
          <img
            src={user.profileImageUrl}
            alt="User Avatar"
            className="rounded-circle border border-light mb-2 shadow-sm"
            width="90"
            height="90"
          />
          <h6 className="fw-bold mb-0 text-white">{user?.fullName || "User"}</h6>
          <Link
            to="/my-profile"
            className="text-light small text-decoration-none mt-1 d-inline-block opacity-75"
          >
            View Profile
          </Link>
        </div>

        <hr className="border-light opacity-50" />

        {/* Menu Items */}
        <ul className="nav flex-column">
          {visibleMenus.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} className="nav-item mb-2">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center px-3 py-2 rounded ${
                    location.pathname === item.path
                      ? "active bg-light text-primary fw-bold"
                      : "text-white opacity-85"
                  }`}
                >
                  {Icon && <Icon className="me-2" />}
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
