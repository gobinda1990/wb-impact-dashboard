import React, { useEffect, useState } from "react";
import {Container,Row,Col,Card,Button,Form,Alert,Image,Spinner,} from "react-bootstrap";
import {getUserProfile,updateUserProfile,uploadProfileImage,} from "../services/dashboardService";
import defaultAvatar from "../assets/avatar.png";
import {FaCamera,FaEnvelope,FaPhone,FaIdCard,FaUser,FaUserTag,} from "react-icons/fa";
import { FiEdit2, FiSave, FiXCircle } from "react-icons/fi";
import "./MyProfilePage.css";

const MyProfilePage = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Convert byte array to Base64 string
  const byteArrayToBase64 = (byteArray) => {
    if (!byteArray) return null;
    const binary = byteArray.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return window.btoa(binary);
  };

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();

        // Convert profile image bytes to Base64 URL
        if (data.profileImage) {
          const base64Image = byteArrayToBase64(data.profileImage);
          data.profileImageUrl = `data:image/png;base64,${base64Image}`;
        }

        setUser(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    loadProfile();
  }, []);

  // Save edited user profile
  const handleSave = async () => {
    try {
      await updateUserProfile(user);
      setMessage("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  // Upload new profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const updatedUser = await uploadProfileImage(file);

      // Convert uploaded image bytes to Base64 URL
      if (updatedUser.profileImage) {
        const base64Image = byteArrayToBase64(updatedUser.profileImage);
        updatedUser.profileImageUrl = `data:image/png;base64,${base64Image}`;
      }

      setUser(updatedUser);
      setMessage("Profile image updated!");
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-bg">
      <Container fluid className="mt-4 fade-in">
        {/* Header */}
        <div className="profile-header text-center py-4 mb-4">
          <h2 className="fw-bold text-white mb-1">My Profile</h2>
          <p className="text-light opacity-75">Manage your personal details</p>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert variant="info" className="text-center shadow-sm glass-alert">
            {message}
          </Alert>
        )}

        {/* Profile Card */}
        <Card className="profile-card shadow-lg border-0 mx-auto">
          <Card.Body className="p-4">
            <Row className="align-items-center mb-4 text-center text-md-start">
              <Col xs={12} md="auto" className="position-relative mb-3 mb-md-0">
                <div className="avatar-wrapper mx-auto mx-md-0">
                  <Image
                    src={user.profileImageUrl || defaultAvatar}
                    alt="User Avatar"
                    roundedCircle
                    width="130"
                    height="130"
                    className="profile-avatar"
                  />
                  <Form.Label
                    htmlFor="fileInput"
                    className="upload-btn rounded-circle"
                    title="Change Profile Picture"
                  >
                    <FaCamera />
                  </Form.Label>
                  <Form.Control
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="upload-spinner">
                      <Spinner animation="border" size="sm" variant="light" />
                    </div>
                  )}
                </div>
              </Col>

              <Col>
                <h5 className="mb-0 fw-semibold text-dark">
                  {user.fullName || "User Name"}
                </h5>
              </Col>
            </Row>

            {/* User Form */}
            <Form>
              <Row className="g-3">
                {/* HRMS Code */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaIdCard className="me-1" /> HRMS Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.hrmsCode || ""}
                    readOnly
                    className="readonly-field"
                  />
                </Col>

                {/* Full Name */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaUser className="me-1" /> Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.fullName || ""}
                    readOnly
                    className="readonly-field"
                  />
                </Col>

                {/* PAN No */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaIdCard className="me-1" /> PAN No
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.panNo || ""}
                    readOnly
                    className="readonly-field"
                  />
                </Col>

                {/* Designation */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaUserTag className="me-1" /> Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.desigCd || ""}
                    readOnly
                    className="readonly-field"
                  />
                </Col>

                {/* Email */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaEnvelope className="me-1" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={user.email || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </Col>

                {/* Phone */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaPhone className="me-1" /> Phone
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.phoneNo || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, phoneNo: e.target.value })
                    }
                  />
                </Col>

                {/* GPF No */}
                <Col md={6}>
                  <Form.Label className="fw-bold">GPF No</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.gpfNo || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, gpfNo: e.target.value })
                    }
                  />
                </Col>

                {/* BO ID */}
                <Col md={6}>
                  <Form.Label className="fw-bold">BO ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.boId || ""}
                    readOnly={!editMode}
                    onChange={(e) => setUser({ ...user, boId: e.target.value })}
                  />
                </Col>
              </Row>
            </Form>
          </Card.Body>

          {/* Card Footer Buttons */}
          <Card.Footer className="text-center text-md-end bg-transparent border-0">
            {!editMode ? (
              <Button
                variant="primary"
                className="rounded-pill px-4 shadow-sm"
                onClick={() => setEditMode(true)}
              >
                <FiEdit2 className="me-1" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  className="me-2 rounded-pill px-4 shadow-sm"
                  onClick={handleSave}
                >
                  <FiSave className="me-1" /> Save
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-pill px-4 shadow-sm"
                  onClick={() => setEditMode(false)}
                >
                  <FiXCircle className="me-1" /> Cancel
                </Button>
              </>
            )}
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default MyProfilePage;
