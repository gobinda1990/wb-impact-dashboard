import React, { useState, useEffect } from "react";
import { Modal, Card, Button, Row, Col, Table, Spinner, Collapse, Badge, Alert } from "react-bootstrap";
import {
  FaIdCard,
  FaUserTie,
  FaBuilding,
  FaProjectDiagram,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { fetchUserDetails, fetchUserPostingDetails, fetchUserProjectDetails } from "../services/userService";

const UserDetailModal = ({ show, onClose, user, getOfficeName, getProjectName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userDetails, setUserDetails] = useState({});
  const [postings, setPostings] = useState([]);
  const [modules, setModules] = useState([]);

  const [openEmployee, setOpenEmployee] = useState(true);
  const [openPosting, setOpenPosting] = useState(true);
  const [openModules, setOpenModules] = useState(true);
  const [openHistory, setOpenHistory] = useState(true);

  const hrmsCode = user?.hrmsCode;

  // ------------------- Load Data from backend -------------------
  useEffect(() => {
    if (!show || !hrmsCode) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [details, postingsData, modulesData] = await Promise.all([
          fetchUserDetails(hrmsCode),
          fetchUserPostingDetails(hrmsCode),
          fetchUserProjectDetails(hrmsCode),
        ]);

        setUserDetails(details || {});
        setPostings(postingsData || []);
        setModules(modulesData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [show, hrmsCode]);

  // ------------------- Reset state on close -------------------
  useEffect(() => {
    if (!show) {
      setUserDetails({});
      setPostings([]);
      setModules([]);
      setError("");
      setLoading(true);
    }
  }, [show]);

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // ------------------- Styles -------------------
  const cardHeaderStyle = { backgroundColor: "#004b8d", color: "white", cursor: "pointer" };
  const cardBodyStyle = { backgroundColor: "#f9fbfd" };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered backdrop="static">
      <Modal.Header closeButton style={{ background: "#002147", color: "white" }}>
        <Modal.Title>{userDetails.fullName || "Employee Details"}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2">Loading user details...</div>
          </div>
        ) : error ? (
          <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>
        ) : (
          <>
            {/* Employee Section */}
            <Card className="mb-3 shadow-sm border-0 rounded-3">
              <Card.Header
                onClick={() => setOpenEmployee(!openEmployee)}
                className="d-flex justify-content-between align-items-center"
                style={cardHeaderStyle}
              >
                <span><FaIdCard className="me-2" /> Employee Details</span>
                {openEmployee ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openEmployee}>
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center">
                      <div
                        className="p-2 rounded-circle border border-3 border-primary d-inline-block bg-white"
                        style={{ width: 110, height: 110 }}
                      >
                        <img
                          src={userDetails.imageurl || "/images/defaultavatar.png"}
                          alt="Profile"
                          className="rounded-circle"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="mt-2 fw-semibold text-primary small">{userDetails.fullName}</div>
                    </Col>
                    <Col md={9}>
                      <Row className="g-3">
                        <Col md={6}>
                          <div className="bg-white p-2 rounded shadow-sm h-100">
                            <div className="text-muted small mb-1"><FaIdCard className="me-1 text-primary" /> HRMS Code</div>
                            <div className="fw-semibold text-dark">{userDetails.hrmsCode}</div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="bg-white p-2 rounded shadow-sm h-100">
                            <div className="text-muted small mb-1"><FaUserTie className="me-1 text-primary" /> Designation</div>
                            <div className="fw-semibold text-dark">{userDetails.desigName}</div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="bg-white p-2 rounded shadow-sm h-100">
                            <div className="text-muted small mb-1"><FaEnvelope className="me-1 text-primary" /> Email</div>
                            <div className="fw-semibold text-dark">{userDetails.email}</div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="bg-white p-2 rounded shadow-sm h-100">
                            <div className="text-muted small mb-1"><FaPhone className="me-1 text-primary" /> Phone</div>
                            <div className="fw-semibold text-dark">{userDetails.phoneNo}</div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Collapse>
            </Card>

            {/* Posting Section */}
            <Card className="mb-3 shadow-sm border-0 rounded-3">
              <Card.Header
                onClick={() => setOpenPosting(!openPosting)}
                className="d-flex justify-content-between align-items-center"
                style={cardHeaderStyle}
              >
                <span><FaBuilding className="me-2" /> Postings</span>
                {openPosting ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openPosting}>
                <Card.Body>
                  {safeArray(postings).length > 0 ? (
                    <div className="table-responsive">
                      <Table bordered hover size="sm" className="text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Posting Type</th>
                            <th>Office Type</th>
                            <th>Office Name</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {postings.map((p, idx) => (
                            <tr key={idx}>
                              <td>{p.postingType === "M" ? "Main" : p.postingType === "A" ? "Additional" : "-"}</td>
                              <td>{p.officeType === "CI" ? "Circle" : p.officeType === "CH" ? "Charge" : p.officeType === "OF" ? "Office" : "-"}</td>
                              <td>{p.officeName}</td>
                              <td>{p.status === "L" ? "Active" : "Inactive"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-muted">No postings assigned</div>
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* Modules Section */}
            <Card className="mb-3 shadow-sm border-0 rounded-3">
              <Card.Header
                onClick={() => setOpenModules(!openModules)}
                className="d-flex justify-content-between align-items-center"
                style={cardHeaderStyle}
              >
                <span><FaProjectDiagram className="me-2" /> Modules</span>
                {openModules ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openModules}>
                <Card.Body>
                  {safeArray(modules).length > 0 ? (
                    <div className="table-responsive">
                      <Table bordered hover size="sm" className="text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Module Name</th>
                            <th>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modules.map((m, idx) => (
                            <tr key={idx}>
                              <td>{m.projectName}</td>
                              <td>{m.roleName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-muted">No modules assigned</div>
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* User History Section */}
            <Card className="shadow-sm border-0 rounded-3 mb-3">
              <Card.Header
                onClick={() => setOpenHistory(!openHistory)}
                className="d-flex justify-content-between align-items-center"
                style={cardHeaderStyle}
              >
                <span><FaCalendarAlt className="me-2" /> User History</span>
                {openHistory ? <FaChevronUp /> : <FaChevronDown />}
              </Card.Header>
              <Collapse in={openHistory}>
                <Card.Body>
                  <Row>
                    <Col md={6}><strong>Last Posting:</strong> {userDetails.last_posting || "-"}</Col>
                    <Col md={6}><strong>Last Modules:</strong> {safeArray(userDetails.last_module_ids).map(getProjectName).join(", ") || "-"}</Col>
                  </Row>
                </Card.Body>
              </Collapse>
            </Card>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
