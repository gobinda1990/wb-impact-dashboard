// import React, { useEffect, useState } from "react";
// import {Container,Row,Col,Card,Button,Form,Alert,Image,Spinner} from "react-bootstrap";
// import {getUserProfile,updateUserProfile,uploadProfileImage} from "../services/dashboardService";
// import defaultAvatar from "../assets/avatar.png";
// import {FaCamera,FaEnvelope,FaPhone,FaIdCard,FaUser,FaUserTag} from "react-icons/fa";
// import { FiEdit2, FiSave, FiXCircle } from "react-icons/fi";
// import "./MyProfilePage.css";

// const MyProfilePage = () => {
//   const [user, setUser] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [message, setMessage] = useState("");
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await getUserProfile();
//         setUser(data);
//       } catch (err) {
//         console.error("Error fetching profile", err);
//       }
//     };
//     loadProfile();
//   }, []);

//   const handleSave = async () => {
//     try {
//       await updateUserProfile(user);
//       setMessage("Profile updated successfully!");
//       setEditMode(false);
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setMessage("Failed to update profile");
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     try {
//       const imageUrl = await uploadProfileImage(file);
//       console.log("photo uploded at >>>"+imageUrl);
//       setUser({ ...user, profileImageUrl: imageUrl });
//       setMessage("Profile image updated!");
//     } catch (err) {
//       console.error("Upload failed", err);
//       setMessage("Failed to upload image");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="profile-bg">
//       <Container fluid className="mt-4 fade-in">
//         {/* Header */}
//         <div className="profile-header text-center py-4 mb-4">
//           <h2 className="fw-bold text-white mb-1">My Profile</h2>
//           <p className="text-light opacity-75">
//             Manage your personal details
//           </p>
//         </div>

//         {message && (
//           <Alert variant="info" className="text-center shadow-sm glass-alert">
//             {message}
//           </Alert>
//         )}

//         <Card className="profile-card shadow-lg border-0 mx-auto">
//           <Card.Body className="p-4">
//             <Row className="align-items-center mb-4 text-center text-md-start">
//               <Col xs={12} md="auto" className="position-relative mb-3 mb-md-0">
//                 <div className="avatar-wrapper mx-auto mx-md-0">
//                   <Image
//                     src={user.profileImageUrl}
//                     alt="User Avatar"
//                     roundedCircle
//                     width="130"
//                     height="130"
//                     className="profile-avatar"
//                   />
//                   <Form.Label
//                     htmlFor="fileInput"
//                     className="upload-btn rounded-circle"
//                     title="Change Profile Picture"
//                   >
//                     <FaCamera />
//                   </Form.Label>
//                   <Form.Control
//                     id="fileInput"
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleImageUpload}
//                     disabled={uploading}
//                   />
//                   {uploading && (
//                     <div className="upload-spinner">
//                       <Spinner animation="border" size="sm" variant="light" />
//                     </div>
//                   )}
//                 </div>
//               </Col>

//               <Col>
//                 <h5 className="mb-0 fw-semibold text-dark">
//                   {user.fullName || "User Name"}
//                 </h5>               
//               </Col>
//             </Row>

//             <Form>
//               <Row className="g-3">
//                 {/* HRMS Code - locked */}
//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaIdCard className="me-1" /> HRMS Code
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.hrmsCode || ""}
//                     readOnly
//                     className="readonly-field"
//                   />
//                 </Col>

//                 {/* Full Name - locked */}
//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaUser className="me-1" /> Full Name
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.fullName || ""}
//                     readOnly
//                     className="readonly-field"
//                   />
//                 </Col>

//                 {/* PAN No - locked */}
//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaIdCard className="me-1" /> PAN No
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.panNo || ""}
//                     readOnly
//                     className="readonly-field"
//                   />
//                 </Col>

//                 {/* Designation - locked */}
//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaUserTag className="me-1" /> Designation
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.desigName || ""}
//                     readOnly
//                     className="readonly-field"
//                   />
//                 </Col>

//                 {/* Editable fields start here */}
//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaEnvelope className="me-1" /> Email
//                   </Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={user.email || ""}
//                     readOnly={!editMode}
//                     onChange={(e) =>
//                       setUser({ ...user, email: e.target.value })
//                     }
//                   />
//                 </Col>

//                 <Col md={6}>
//                   <Form.Label className="fw-bold">
//                     <FaPhone className="me-1" /> Phone
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.phoneNo || ""}
//                     readOnly={!editMode}
//                     onChange={(e) =>
//                       setUser({ ...user, phoneNo: e.target.value })
//                     }
//                   />
//                 </Col>

//                 <Col md={6}>
//                   <Form.Label className="fw-bold">GPF No</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.gpfNo || ""}
//                     readOnly={!editMode}
//                     onChange={(e) =>
//                       setUser({ ...user, gpfNo: e.target.value })
//                     }
//                   />
//                 </Col>

//                 <Col md={6}>
//                   <Form.Label className="fw-bold">BO ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={user.boId || ""}
//                     readOnly={!editMode}
//                     onChange={(e) => setUser({ ...user, boId: e.target.value })}
//                   />
//                 </Col>
//               </Row>
//             </Form>
//           </Card.Body>

//           <Card.Footer className="text-center text-md-end bg-transparent border-0">
//             {!editMode ? (
//               <Button
//                 variant="primary"
//                 className="rounded-pill px-4 shadow-sm"
//                 onClick={() => setEditMode(true)}
//               >
//                 <FiEdit2 className="me-1" />
//                 Edit Profile
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   variant="success"
//                   className="me-2 rounded-pill px-4 shadow-sm"
//                   onClick={handleSave}
//                 >
//                   <FiSave className="me-1" />
//                   Save
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   className="rounded-pill px-4 shadow-sm"
//                   onClick={() => setEditMode(false)}
//                 >
//                   <FiXCircle className="me-1" />
//                   Cancel
//                 </Button>
//               </>
//             )}
//           </Card.Footer>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default MyProfilePage;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Image, Spinner } from "react-bootstrap";
import { getUserProfile, updateUserProfile, uploadProfileImage } from "../services/dashboardService";
import defaultAvatar from "../assets/avatar.png";
import { FaCamera, FaEnvelope, FaPhone, FaIdCard, FaUser, FaUserTag, FaHeart } from "react-icons/fa";
import { FiEdit2, FiSave, FiXCircle } from "react-icons/fi";
import "./MyProfilePage.css";

const MyProfilePage = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    loadProfile();
  }, []);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      console.log("photo uploded at >>>" + imageUrl);
      setUser({ ...user, profileImageUrl: imageUrl });
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
          <p className="text-light opacity-75">
            Manage your personal details
          </p>
        </div>

        {message && (
          <Alert variant="info" className="text-center shadow-sm glass-alert">
            {message}
          </Alert>
        )}

        <Card className="profile-card shadow-lg border-0 mx-auto">
          <Card.Body className="p-4">
            <Row className="align-items-center mb-4 text-center text-md-start">
              <Col xs={12} md="auto" className="position-relative mb-3 mb-md-0">
                <div className="avatar-wrapper mx-auto mx-md-0">
                  <Image
                    src={user.profileImageUrl}
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

            <Form>
              <Card className="mt-4 shadow-sm border-0">
                  <Card.Header className="fw-bold bg-light">
                    Employee Details
                  </Card.Header>
                  <Card.Body>
              <Row className="g-3">
                {/* HRMS Code - locked */}
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

                {/* Full Name - locked */}
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

                {/* PAN No - locked */}
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

                {/* Designation - locked */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaUserTag className="me-1" /> Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.desigName || ""}
                    readOnly
                    className="readonly-field"
                  />
                </Col>
               

                {/* Editable fields start here */}
                <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaIdCard className="me-1" /> Joining Ordr No 
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={user.joiningOrderNo || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, joining_order_no: e.target.value })
                    }
                  />
                </Col>
                 <Col md={6}>
                  <Form.Label className="fw-bold">
                    <FaHeart className="me-1" /> Blood Group. 
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={user.bloodGroup || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, blood_grp: e.target.value })
                    }
                  />
                </Col>
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

                <Col md={6}>
                  <Form.Label className="fw-bold"> <FaIdCard className="me-1" /> GPF No</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.gpfNo || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setUser({ ...user, gpfNo: e.target.value })
                    }
                  />
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-bold"> <FaUserTag className="me-1" /> BO ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.boId || ""}
                    readOnly={!editMode}
                    onChange={(e) => setUser({ ...user, boId: e.target.value })}
                  />
                </Col>
                 
                </Row>
                 </Card.Body>
                </Card>

               
                {/* Address Card */}
                <Card className="mt-4 shadow-sm border-0">
                  <Card.Header className="fw-bold bg-light">
                    Address Details
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          House No./Street Name.
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={user.houseNo || ""}
                          readOnly={!editMode}
                          onChange={(e) =>
                            setUser({ ...user, buildingStreet: e.target.value })
                          }
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label className="fw-bold">Police Station</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.policeStation || ""}
                          readOnly={!editMode}
                          onChange={(e) =>
                            setUser({ ...user, policeStation: e.target.value })
                          }
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label className="fw-bold">District</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.district || ""}
                          readOnly={!editMode}
                          onChange={(e) =>
                            setUser({ ...user, district: e.target.value })
                          }
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label className="fw-bold">State</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.state || ""}
                          readOnly={!editMode}
                          onChange={(e) =>
                            setUser({ ...user, state: e.target.value })
                          }
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label className="fw-bold">Pin Code</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.pinCode || ""}
                          readOnly={!editMode}
                          onChange={(e) =>
                            setUser({ ...user, pinCode: e.target.value })
                          }
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

              
            </Form>
          </Card.Body>

          <Card.Footer className="text-center text-md-end bg-transparent border-0">
            {!editMode ? (
              <Button
                variant="primary"
                className="rounded-pill px-4 shadow-sm"
                onClick={() => setEditMode(true)}
              >
                <FiEdit2 className="me-1" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  className="me-2 rounded-pill px-4 shadow-sm"
                  onClick={handleSave}
                >
                  <FiSave className="me-1" />
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-pill px-4 shadow-sm"
                  onClick={() => setEditMode(false)}
                >
                  <FiXCircle className="me-1" />
                  Cancel
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


