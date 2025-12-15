import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSyncAlt } from "react-icons/fa";
import { login } from "../services/authService"; // this will send captchaInput + captcha

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  /** Generate CAPTCHA */
  const generateCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(newCaptcha);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 26px 'Roboto'";
    ctx.fillStyle = "#333";
    ctx.fillText(newCaptcha, 20, 30);

    // Add random noise lines
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
    setError("");
    setLoading(true);

    try {
      // ✅ Pass all fields to backend (username, password, captchaInput, captcha)
      await login(username, password, captchaInput, captcha);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{
        height: "100vh",
        backgroundImage: `url("/images/ctd2.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "90%",
          maxWidth: "400px",
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div className="text-center mb-3">
          <img
            src="/images/bangla.png"
            alt="Logo"
            className="img-fluid mb-2"
            style={{ width: "120px", height: "120px" }}
          />
          <h4 className="fw-bold text-dark">Impact 2.0 Login</h4>
          <p className="text-muted small">Secure access to your dashboard</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3 position-relative">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaUser color="#6c757d" />
              </span>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaLock color="#6c757d" />
              </span>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
              {/* // <div className="text-center mt-3"> */}
          <p className="mb-0 small text-muted text-end" >          
            <span
              onClick={() => navigate("/forgotPassword")}
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Forgot Password
            </span>
          </p>
        {/* </div> */}
          </div>

          {/* CAPTCHA */}
          <div className="mb-3 text-center">
            <canvas
              ref={canvasRef}
              width="150"
              height="40"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "8px",
              }}
            />
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Enter CAPTCHA"
                style={{ width: "65%" }}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={generateCaptcha}
                title="Refresh CAPTCHA"
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 fw-semibold"
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
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
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
