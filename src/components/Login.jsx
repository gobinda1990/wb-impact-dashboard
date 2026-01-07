import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import { login } from "../services/authService";
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // <-- new
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  /** Generate CAPTCHA */
  const generateCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(newCaptcha);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 26px 'Poppins'";
    ctx.fillStyle = "#1a1a1a";
    ctx.fillText(newCaptcha, 20, 30);

    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 150, Math.random() * 40);
      ctx.lineTo(Math.random() * 150, Math.random() * 40);
      ctx.stroke();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /** Handle Login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // reset before attempt

    try {
      await login(username, password, captchaInput, captcha);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Invalid login credentials ❌");
      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-card shadow-lg rounded-4 p-4">
        <div className="text-center mb-3">
          <img src="/images/bangla.png" alt="Logo" className="login-logo" />
          <h4 className="fw-bold text-dark mb-0">Impact 2.0 Login</h4>
          <p className="text-muted small">Secure access to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <div className="input-group login-input">
              <span className="input-group-text bg-white border-end-0">
                <FaUser className="text-muted" />
              </span>
              <input
                id="username"
                type="text"
                className="form-control border-start-0"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <div className="input-group login-input">
              <span className="input-group-text bg-white border-end-0">
                <FaLock className="text-muted" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control border-start-0 border-end-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <span
                className="input-group-text bg-white border-start-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p className="small text-end mt-1 mb-0">
              <span
                onClick={() => navigate("/forgotPassword")}
                className="text-primary text-decoration-underline"
                style={{ cursor: "pointer" }}
              >
                Forgot Password?
              </span>
            </p>
          </div>

          {/* CAPTCHA */}
          <div className="mb-3 text-center">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <canvas ref={canvasRef} width="150" height="40" className="captcha-canvas" />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={generateCaptcha}
                title="Refresh CAPTCHA"
              >
                <FaSyncAlt />
              </button>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-2">
              <input
                type="text"
                className="form-control text-center"
                placeholder="Enter CAPTCHA"
                style={{ maxWidth: "230px" }}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="alert alert-danger text-center py-2">
              {errorMessage}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 fw-semibold login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0 small text-muted">
            Not a user?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary text-decoration-underline"
              style={{ cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
