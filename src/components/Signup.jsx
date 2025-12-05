import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaCalendarAlt,
  FaLock,
  FaQuestionCircle,
  FaSync,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dashboardClient } from "../services/apiClient";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [designation, setDesignation] = useState([]);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    hrms_code: "",
    user_id: "", // mirrors HRMS Code
    full_name: "",
    email: "",
    phone_no: "",
    desig_cd: "",
    gpf_no: "",
    bo_id: "",
    pan_no: "",
    dt_of_join: null,
    dt_of_birth: null,
    gender: "", // added gender
    passwd: "",
    repasswd: "",
    hint_qs_cd: "",
    hint_ans: "",
  });

  useEffect(() => {
    fetchDesignations();
    generateCaptcha();
  }, []);

  const fetchDesignations = async () => {
    try {
      const res = await dashboardClient.get("/auth/designation_details");
      setDesignation(res.data.data || []);
    } catch (err) {
      console.error("Error loading designations:", err);
    }
  };

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 5; i++)
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "hrms_code" ? { user_id: value } : {}), // mirror HRMS Code
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  const validateForm = () => {
    const {
      hrms_code,
      full_name,
      email,
      phone_no,
      passwd,
      repasswd,
      pan_no,
      gender,
    } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!hrms_code || !full_name || !email || !phone_no || !gender) {
      setVariant("danger");
      setMessage("Please fill in all mandatory fields marked with *.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setVariant("danger");
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (!phoneRegex.test(phone_no)) {
      setVariant("danger");
      setMessage("Phone number must be 10 digits and start with 6-9.");
      return false;
    }

    if (pan_no && !panRegex.test(pan_no)) {
      setVariant("danger");
      setMessage("Invalid PAN format (e.g., ABCDE1234F).");
      return false;
    }

    if (!passwordRegex.test(passwd)) {
      setVariant("danger");
      setMessage(
        "Password must be at least 8 characters, contain one uppercase letter and one number."
      );
      return false;
    }

    if (passwd !== repasswd) {
      setVariant("danger");
      setMessage("Passwords do not match.");
      return false;
    }

    // CAPTCHA validation
    if (userCaptcha.trim() !== captcha.trim()) {
      setCaptchaError("CAPTCHA does not match.");
      generateCaptcha();
      setUserCaptcha("");
      return false;
    }

    setCaptchaError("");
    setMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await dashboardClient.post("/auth/signup", {
        ...formData,
        dt_of_join: formData.dt_of_join
          ? formData.dt_of_join.toISOString().split("T")[0]
          : "",
        dt_of_birth: formData.dt_of_birth
          ? formData.dt_of_birth.toISOString().split("T")[0]
          : "",
      });

      if (res.status === 201 || res.status === 200) {
        setVariant("success");
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setVariant("danger");
      setMessage("Failed to register user. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper d-flex justify-content-center align-items-center">
      <Card className="signup-card shadow-lg p-4">
        <div className="text-center mb-3">
          <img src="/images/bangla.png" alt="Gov Logo" width="80" />
          <h4 className="mt-3 text-primary">
            <FaUser className="me-2" /> New User Registration
          </h4>
        </div>

        {message && <Alert variant={variant}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* HRMS Code */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> HRMS Code <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="hrms_code"
                  value={formData.hrms_code}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* User ID (disabled) */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> User ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  disabled
                />
              </Form.Group>
            </Col>

            {/* Full Name */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUser /> Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaEnvelope /> Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Phone */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaPhone /> Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone_no"
                  value={formData.phone_no}
                  maxLength={10}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Gender */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaUser /> Gender <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Designation */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> Designation <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="desig_cd"
                  value={formData.desig_cd}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {designation.map((d) => (
                    <option key={d.desig_cd} value={d.desig_cd}>
                      {d.designation}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* PAN Number */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> PAN Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="pan_no"
                  value={formData.pan_no}
                  maxLength={10}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "pan_no",
                        value: e.target.value.toUpperCase(),
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>

            {/* GPF Number */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> GPF Number
                </Form.Label>
                <Form.Control
                  type="text"
                  name="gpf_no"
                  value={formData.gpf_no}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* BO ID */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaIdBadge /> BO ID
                </Form.Label>
                <Form.Control
                  type="text"
                  name="bo_id"
                  value={formData.bo_id}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Date of Joining */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt /> Date of Joining <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <DatePicker
                    selected={formData.dt_of_join}
                    onChange={(date) => handleDateChange("dt_of_join", date)}
                    dateFormat="dd-MM-yyyy"
                    maxDate={new Date()}
                    placeholderText="Select Date of Joining"
                    className="form-control"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Date of Birth */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt /> Date of Birth <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <DatePicker
                    selected={formData.dt_of_birth}
                    onChange={(date) => handleDateChange("dt_of_birth", date)}
                    dateFormat="dd-MM-yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    placeholderText="Select Date of Birth"
                    className="form-control"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Password */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaLock /> Password <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="passwd"
                    value={formData.passwd}
                    onChange={handleChange}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Confirm Password */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaLock /> Confirm Password <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="repasswd"
                    value={formData.repasswd}
                    onChange={handleChange}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Hint Question */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaQuestionCircle /> Hint Question
                </Form.Label>
                <Form.Select
                  name="hint_qs_cd"
                  value={formData.hint_qs_cd}
                  onChange={handleChange}
                >
                  <option value="">Select Question</option>
                  <option value="Q1">What is your favorite food?</option>
                  <option value="Q2">What is your birth city?</option>
                  <option value="Q3">What is your first school name?</option>
                  <option value="Q4">What is your pet name?</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Hint Answer */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaQuestionCircle /> Hint Answer
                </Form.Label>
                <Form.Control
                  type="text"
                  name="hint_ans"
                  value={formData.hint_ans}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* CAPTCHA */}
          <div className="text-center mb-3">
            <div className="captcha-box border rounded px-4 py-2 bg-light fw-bold d-inline-block">
              {captcha}
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={generateCaptcha}
            >
              <FaSync />
            </Button>
            <Form.Control
              type="text"
              placeholder="Enter CAPTCHA"
              className="mt-2 text-center"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
            />
            {captchaError && <div className="text-danger">{captchaError}</div>}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </Button>

          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold text-decoration-none">
                Log In
              </Link>
            </small>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
