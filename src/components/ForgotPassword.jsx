import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css";

const ForgotPassword = () => {
  const [hrmsCode, setHrmsCode] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const hrmsRef = useRef(null);
  const qsRef = useRef(null);
  const ansRef = useRef(null);
  const pwdRef = useRef(null);
  const cpwdRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!hrmsCode) newErrors.hrmsCode = "HRMS Code is required.";
    else if (!/^[0-9]{10}$/.test(hrmsCode))
      newErrors.hrmsCode = "HRMS Code must be exactly 10 digits.";

    if (!question) newErrors.question = "Please select a security question.";
    if (!answer) newErrors.answer = "Security answer is required.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
      newErrors.password = "Must contain at least one uppercase letter.";
    else if (!/[a-z]/.test(password))
      newErrors.password = "Must contain at least one lowercase letter.";
    else if (!/[0-9]/.test(password))
      newErrors.password = "Must contain at least one number.";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      newErrors.password = "Must contain one special character.";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm password required.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.hrmsCode) hrmsRef.current.focus();
      else if (newErrors.question) qsRef.current.focus();
      else if (newErrors.answer) ansRef.current.focus();
      else if (newErrors.password) pwdRef.current.focus();
      else if (newErrors.confirmPassword) cpwdRef.current.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setMessage("✅ Password reset successfully!");
      setHrmsCode("");
      setQuestion("");
      setAnswer("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label className="forgot-label">HRMS Code</label>
          <input
            type="text"
            value={hrmsCode}
            ref={hrmsRef}
            maxLength={10}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*$/.test(val)) setHrmsCode(val);
            }}
            className="forgot-input"
            placeholder="Enter 10-digit HRMS Code"
          />
          {errors.hrmsCode && <div className="error-msg">{errors.hrmsCode}</div>}

          <label className="forgot-label">Security Question</label>
          <select
            value={question}
            ref={qsRef}
            onChange={(e) => setQuestion(e.target.value)}
            className="forgot-input"
          >
            <option value="">-- Select Question --</option>
            <option value="Q1">What is your favorite food?</option>
            <option value="Q2">What is your birth city?</option>
            <option value="Q3">What is your first school name?</option>
            <option value="Q4">What is your pet name?</option>
            <option value="Q5">What is your nickname?</option>
          </select>
          {errors.question && <div className="error-msg">{errors.question}</div>}

          <label className="forgot-label">Security Answer</label>
          <input
            type="text"
            value={answer}
            ref={ansRef}
            onChange={(e) => setAnswer(e.target.value)}
            className="forgot-input"
            placeholder="Enter answer"
          />
          {errors.answer && <div className="error-msg">{errors.answer}</div>}

          <label className="forgot-label">New Password</label>
          <input
            type="password"
            value={password}
            ref={pwdRef}
            onChange={(e) => setPassword(e.target.value)}
            className="forgot-input"
            placeholder="Enter new password"
          />
          {errors.password && <div className="error-msg">{errors.password}</div>}

          <label className="forgot-label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            ref={cpwdRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="forgot-input"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <div className="error-msg">{errors.confirmPassword}</div>
          )}

          <button type="submit" className="forgot-btn">
            Reset Password
          </button>

          <div className="login-wrapper">
            Remembered password?
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
