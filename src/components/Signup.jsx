import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import "./Signup.css"; // optional custom styling

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setVariant("danger");
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      // TODO: Replace with your signup API
      console.log("User registered:", formData);

      setVariant("success");
      setMessage("✅ Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setVariant("danger");
      setMessage("❌ Failed to register user.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow p-4" style={{ width: "420px" }}>
        <div className="text-center mb-3">
          <FaUserPlus size={32} className="text-primary mb-2" />
          <h4 className="fw-bold text-primary">Create an Account</h4>
          <p className="text-muted small">Join Impact Portal today</p>
        </div>

        {message && <Alert variant={variant}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2 text-secondary" />
              Full Name
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaEnvelope className="me-2 text-secondary" />
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock className="me-2 text-secondary" />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock className="me-2 text-secondary" />
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-semibold mt-2"
          >
            Sign Up
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary fw-semibold text-decoration-none"
            >
              Log in
            </Link>
          </small>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
