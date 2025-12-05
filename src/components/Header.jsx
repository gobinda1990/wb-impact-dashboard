import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import govLogo from "../assets/logo.png";
import { Bell, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm sticky-top"
      style={{
        background: "linear-gradient(90deg, #002147 0%, #004b8d 100%)",
      }}
    >
      <div className="d-flex align-items-center">
        <img
          src={govLogo}
          alt="Government Logo"
          width="45"
          height="45"
          className="me-2 rounded-circle bg-white p-1"
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <Bell className="text-light" size={22} />
        <User
          className="text-light cursor-pointer"
          size={22}
          onClick={() => navigate("/my-profile")}
        />
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
