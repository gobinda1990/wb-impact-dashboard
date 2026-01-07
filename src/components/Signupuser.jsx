import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardClient } from "../services/apiClient";
import {
  FaSyncAlt,
  FaUser,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaIdCard,
  FaCalendarAlt,
  FaLock,
  FaQuestionCircle,
  FaRegLightbulb,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isValid } from "date-fns";
import "../css/SignupStyle.css";

export default function SignupUser() {
  const [designation, setDesignations] = useState([]);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [errors, setErrors] = useState({});
  const canvasRef = useRef(null);

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // success | error

  const [formData, setFormData] = useState({
    hrms_code: "",
    usr_ID: "",
    full_name: "",
    gender: "",
    email: "",
    phone_no: "",
    desig_cd: "",
    bo_id: "",
    gpf_no: "",
    dt_of_join: "",
    dt_of_birth: "",
    pan_no: "",
    passwd: "",
    repasswd: "",
    hint_qs_cd: "",
    hint_ans: "",
  });

  useEffect(() => {
    fetchDesig();
    generateCaptcha();
  }, []);

  const fetchDesig = async () => {
    try {
      const response = await dashboardClient.get("/auth/designation_details");
      setDesignations(response.data.data);
    } catch (err) {
      console.error("Error fetching designations:", err.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const generateCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(newCaptcha);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 26px 'Roboto'";
    ctx.fillStyle = "#333";
    ctx.fillText(newCaptcha, 20, 30);

    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 150, Math.random() * 40);
      ctx.lineTo(Math.random() * 150, Math.random() * 40);
      ctx.stroke();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hrms_code) newErrors.hrms_code = "HRMS Code is required";
    if (!formData.full_name) newErrors.full_name = "Full Name is required";
    if (!formData.gender) newErrors.gender = "Select a gender";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone_no.match(/^\d{10}$/))
      newErrors.phone_no = "Phone must be 10 digits";
    if (!formData.desig_cd) newErrors.desig_cd = "Select a designation";
    if (!formData.pan_no.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
      newErrors.pan_no = "Invalid PAN format";
    if (!formData.dt_of_join) newErrors.dt_of_join = "Joining date required";
    if (!formData.dt_of_birth) newErrors.dt_of_birth = "Birth date required";
    if (!formData.passwd.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/))
      newErrors.passwd =
        "Password must have 8+ chars, 1 uppercase & 1 special symbol";
    if (formData.passwd !== formData.repasswd)
      newErrors.repasswd = "Passwords do not match";
    if (!formData.hint_qs_cd) newErrors.hint_qs_cd = "Select a hint question";
    if (!formData.hint_ans) newErrors.hint_ans = "Hint Answer required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Popup helper
  const showPopup = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (captchaInput !== captcha) {
      setCaptchaError("CAPTCHA does not match");
      generateCaptcha();
      setCaptchaInput("");
      return;
    } else {
      setCaptchaError("");
    }

    try {
      const response = await dashboardClient.post(
        "/auth/signup",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        showPopup("Signup Successful", "success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        showPopup(
          response.data?.message || "Signup failed. Please check your details.",
          "error"
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      const backendMessage =
        error.response?.data?.message ||
        "Signup failed. Please check your details.";
      showPopup(backendMessage, "error");
    }
  };

  return (
    <div
      className="signup-container d-flex align-items-center justify-content-center fade-in"
      style={{
        minHeight: "100vh",
        backgroundImage: `url("/images/ctd2.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "900px",
          width: "95%",
          borderRadius: "15px",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <div className="text-center">
          <img
            src="/images/bangla.png"
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
            className="mb-3"
          />
          <h3 className="fw-bold mb-4">Sign Up for New User</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* HRMS Code */}
            <div className="col-md-6">
              <label className="form-label">
                <FaIdCard className="me-2 text-primary" /> HRMS Code
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                maxLength={10}
                value={formData.hrms_code}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value) &&
                  handleChange("hrms_code", e.target.value)
                }
              />
              {errors.hrms_code && (
                <small className="text-danger">{errors.hrms_code}</small>
              )}
            </div>

            {/* User ID */}
            <div className="col-md-6">
              <label className="form-label">
                <FaUser className="me-2 text-primary" /> User ID
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                value={formData.hrms_code}
                readOnly
              />
            </div>

            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">
                <FaUser className="me-2 text-primary" /> Full Name
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />
              {errors.full_name && (
                <small className="text-danger">{errors.full_name}</small>
              )}
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label className="form-label">
                <FaVenusMars className="me-2 text-primary" /> Gender
                <span className="text-danger">*</span>
              </label>
              <select
                className="form-select glow-input"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Others</option>
              </select>
              {errors.gender && (
                <small className="text-danger">{errors.gender}</small>
              )}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">
                <FaEnvelope className="me-2 text-primary" /> Email
                <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control glow-input"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label">
                <FaPhone className="me-2 text-primary" /> Phone Number
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                maxLength={10}
                value={formData.phone_no}
                onChange={(e) => handleChange("phone_no", e.target.value)}
              />
              {errors.phone_no && (
                <small className="text-danger">{errors.phone_no}</small>
              )}
            </div>

            {/* Designation */}
            <div className="col-md-6">
              <label className="form-label">
                <FaBriefcase className="me-2 text-primary" /> Designation
                <span className="text-danger">*</span>
              </label>
              <select
                className="form-select glow-input"
                value={formData.desig_cd}
                onChange={(e) => handleChange("desig_cd", e.target.value)}
              >
                <option value="">Select Designation</option>
                {designation.map((d) => (
                  <option key={d.desig_cd} value={d.desig_cd}>
                    {d.designation}
                  </option>
                ))}
              </select>
              {errors.desig_cd && (
                <small className="text-danger">{errors.desig_cd}</small>
              )}
            </div>

            {/* PAN */}
            <div className="col-md-6">
              <label className="form-label">
                <FaIdCard className="me-2 text-primary" /> PAN Number
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                maxLength={10}
                value={formData.pan_no}
                onChange={(e) =>
                  handleChange("pan_no", e.target.value.toUpperCase())
                }
              />
              {errors.pan_no && (
                <small className="text-danger">{errors.pan_no}</small>
              )}
            </div>

            {/* BO ID */}
            <div className="col-md-6">
              <label className="form-label">
                <FaIdCard className="me-2 text-primary" /> BO ID
              </label>
              <input
                type="text"
                className="form-control glow-input"
                value={formData.bo_id}
                onChange={(e) => handleChange("bo_id", e.target.value)}
              />
            </div>

            {/* GPF */}
            <div className="col-md-6">
              <label className="form-label">
                <FaIdCard className="me-2 text-primary" /> GPF Number
              </label>
              <input
                type="text"
                className="form-control glow-input"
                value={formData.gpf_no}
                onChange={(e) => handleChange("gpf_no", e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div className="col-md-6 position-relative">
              <label className="form-label">
                <FaCalendarAlt className="me-2 text-primary" /> Date of Birth
                <span className="text-danger">*</span>
              </label>
              <DatePicker
                selected={
                  formData.dt_of_birth ? new Date(formData.dt_of_birth) : null
                }
                onChange={(date) => {
                  if (date && isValid(date)) {
                    handleChange(
                      "dt_of_birth",
                      date.toISOString().split("T")[0]
                    );
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date of Birth"
                className="form-control glow-input custom-datepicker"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              {errors.dt_of_birth && (
                <small className="text-danger">{errors.dt_of_birth}</small>
              )}
            </div>

            {/* Date of Joining */}
            <div className="col-md-6 position-relative">
              <label className="form-label">
                <FaCalendarAlt className="me-2 text-primary" /> Date of Joining
                <span className="text-danger">*</span>
              </label>
              <DatePicker
                selected={
                  formData.dt_of_join ? new Date(formData.dt_of_join) : null
                }
                onChange={(date) => {
                  if (date && isValid(date)) {
                    handleChange("dt_of_join", date.toISOString().split("T")[0]);
                  }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date of Joining"
                className="form-control glow-input custom-datepicker"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              {errors.dt_of_join && (
                <small className="text-danger">{errors.dt_of_join}</small>
              )}
            </div>

            {/* Password */}
            <div className="col-md-6">
              <label className="form-label">
                <FaLock className="me-2 text-primary" /> Password
                <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control glow-input"
                value={formData.passwd}
                onChange={(e) => handleChange("passwd", e.target.value)}
              />
              {errors.passwd && (
                <small className="text-danger">{errors.passwd}</small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="col-md-6">
              <label className="form-label">
                <FaLock className="me-2 text-primary" /> Confirm Password
                <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control glow-input"
                value={formData.repasswd}
                onChange={(e) => handleChange("repasswd", e.target.value)}
              />
              {errors.repasswd && (
                <small className="text-danger">{errors.repasswd}</small>
              )}
            </div>

            {/* Hint Question */}
            <div className="col-md-6">
              <label className="form-label">
                <FaQuestionCircle className="me-2 text-primary" /> Hint Question
                <span className="text-danger">*</span>
              </label>
              <select
                className="form-select glow-input"
                value={formData.hint_qs_cd}
                onChange={(e) => handleChange("hint_qs_cd", e.target.value)}
              >
                <option value="">Select Question</option>
                <option value="Q1">What is your favorite food?</option>
                <option value="Q2">What is your birth city?</option>
                <option value="Q3">What is your first school name?</option>
                <option value="Q4">What is your pet name?</option>
                <option value="Q5">What is your nickname?</option>
              </select>
              {errors.hint_qs_cd && (
                <small className="text-danger">{errors.hint_qs_cd}</small>
              )}
            </div>

            {/* Hint Answer */}
            <div className="col-md-6">
              <label className="form-label">
                <FaRegLightbulb className="me-2 text-primary" /> Hint Answer
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control glow-input"
                value={formData.hint_ans}
                onChange={(e) => handleChange("hint_ans", e.target.value)}
              />
              {errors.hint_ans && (
                <small className="text-danger">{errors.hint_ans}</small>
              )}
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="text-center mt-4">
            <div className="d-flex justify-content-center align-items-center mb-2">
              <canvas
                ref={canvasRef}
                width="150"
                height="40"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={generateCaptcha}
                title="Refresh CAPTCHA"
              >
                <FaSyncAlt />
              </button>
            </div>
            <input
              type="text"
              className="form-control mx-auto glow-input"
              placeholder="Enter CAPTCHA"
              style={{ width: "200px" }}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
            {captchaError && (
              <small className="text-danger">{captchaError}</small>
            )}
          </div>

          {/* Submit */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 fw-semibold glow-btn"
            >
              <FaUser className="me-2" />
              Sign Up
            </button>
            <p className="mt-3">
              Already a user?{" "}
              <span
                className="text-primary fw-bold"
                role="button"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>

      {/* ✅ Bootstrap Modal Popup */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className={`modal-header ${
                  modalType === "success" ? "bg-success" : "bg-danger"
                } text-white`}
              >
                <h5 className="modal-title">
                  {modalType === "success" ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className={`btn ${
                    modalType === "success" ? "btn-success" : "btn-danger"
                  } px-4`}
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
