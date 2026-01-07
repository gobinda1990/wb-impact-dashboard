import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Form,
  Table,
  Alert,
  Spinner,
  Collapse,
} from "react-bootstrap";
import {
  FaUserMinus,
  FaIdCard,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  doReleaseEmp,
  fetchUserDetails,
  fetchUserPostingDetails,
  fetchUserProjectDetails,
} from "../services/userService";

const ReleaseModal = ({ user, show, onClose, onComplete, projects = [] }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userDetails, setUserDetails] = useState({});
  const [postings, setPostings] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [selectedPostings, setSelectedPostings] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);

  const [openEmployee, setOpenEmployee] = useState(true);
  const [openPostings, setOpenPostings] = useState(true);
  const [openModules, setOpenModules] = useState(true);
  const [openRemarks, setOpenRemarks] = useState(true);

  const hrmsCode = user?.hrmsCode;

  // ------------------- Load Data -------------------
  useEffect(() => {
    if (!show || !hrmsCode) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [details, postingData, projectData] = await Promise.all([
          fetchUserDetails(hrmsCode),
          fetchUserPostingDetails(hrmsCode),
          fetchUserProjectDetails(hrmsCode),
        ]);
        setUserDetails(details || {});
        setPostings(postingData || []);
        setAssignedProjects(projectData || []);
        setSelectedPostings([]);
        setSelectedProjects([]);
        setRemarks("");
        setError("");
        setSuccess("");
      } catch (err) {
        console.error(err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [show, hrmsCode]);

  // ------------------- Toggle Selection -------------------
  const togglePosting = (postingType, officeId) => {
    const key = `${postingType}-${officeId}`;
    setSelectedPostings((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleProject = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((p) => p !== projectId)
        : [...prev, projectId]
    );
  };

  // ------------------- Handle Release -------------------
  const handleRelease = () => {
    setError("");
    if (selectedPostings.length === 0 && selectedProjects.length === 0) {
      setError("Please select at least one posting or module to release.");
      return;
    }
    if (!remarks.trim()) {
      setError("Please enter remarks.");
      return;
    }
    setConfirmModal(true);
  };

  const confirmRelease = async () => {
    setSaving(true);
    setConfirmModal(false);
    setError("");
    setSuccess("");

    try {
      const payload = {
        hrmsCode,
        releasePostings: postings
          .filter((p) => selectedPostings.includes(`${p.postingType}-${p.officeId}`))
          .map((p) => ({
            postingType: p.postingType,
            officeType: p.officeType,
            officeId: p.officeId,
          })),
        releaseProjects: assignedProjects
          .filter((m) => selectedProjects.includes(m.projectId))
          .map((m) => ({
            projectId: m.projectId,
            roleId: m.roleId,
          })),
        remarks,
      };

      const response = await doReleaseEmp(payload);

      if (response?.success) {
        setSuccess("✅ User released successfully!");
        setTimeout(async () => {
          setSuccess("");
          if (typeof onComplete === "function") await onComplete();
        }, 1500);
      } else {
        throw new Error(response?.message || "Failed to release user.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error during release.");
    } finally {
      setSaving(false);
    }
  };

  const headerStyle = { background: "#004b8d", color: "white", cursor: "pointer" };

  return (
    <>
      <Modal show={show} onHide={onClose} size="xl" centered backdrop="static">
        <Modal.Header closeButton style={{ background: "#002147", color: "white" }}>
          <Modal.Title>
            <FaUserMinus className="me-2" /> Release User – {userDetails.fullName || "Employee"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "#f9fbfd" }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <div className="mt-2 text-muted fw-semibold">Loading user details...</div>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                  <FaExclamationTriangle className="me-2" />
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" onClose={() => setSuccess("")} dismissible>
                  {success}
                </Alert>
              )}

              {/* Employee Section */}
              <Card className="mb-3 shadow-sm border-0 rounded-3">
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => setOpenEmployee(!openEmployee)}
                  style={headerStyle}
                >
                  <span>
                    <FaIdCard className="me-2" /> Employee Details
                  </span>
                  {openEmployee ? <FaChevronUp /> : <FaChevronDown />}
                </Card.Header>
                <Collapse in={openEmployee}>
                  <Card.Body>
                    <Row className="align-items-center">
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
                          {[{ icon: FaIdCard, label: "HRMS Code", value: userDetails.hrmsCode },
                          { icon: FaUserTie, label: "Designation", value: userDetails.desigName },
                          { icon: FaEnvelope, label: "Email", value: userDetails.email },
                          { icon: FaPhone, label: "Phone", value: userDetails.phoneNo }].map((info, idx) => (
                            <Col md={6} key={idx}>
                              <div className="bg-white p-2 rounded shadow-sm">
                                <div className="text-muted small mb-1">
                                  <info.icon className="me-1 text-primary" /> {info.label}
                                </div>
                                <div className="fw-semibold text-dark">{info.value}</div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Collapse>
              </Card>


              {/* Postings Section */}
              <Card className="mb-3 shadow-sm border-0 rounded-3">
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => setOpenPostings(!openPostings)}
                  style={headerStyle}
                >
                  <span>Postings</span>
                  {openPostings ? <FaChevronUp /> : <FaChevronDown />}
                </Card.Header>
                <Collapse in={openPostings}>
                  <Card.Body>
                    {postings.length ? (
                      <Table bordered hover responsive size="sm" className="align-middle text-center">
                        <thead className="table-light">
                          <tr>
                            <th>Posting Type</th>
                            <th>Office Type</th>
                            <th>Office Name</th>
                            <th>Select</th> {/* Move checkbox to last */}
                          </tr>
                        </thead>
                        <tbody>
                          {postings.map((p, idx) => {
                            const key = `${p.postingType}-${p.officeId}`;
                            return (
                              <tr key={idx}>
                                <td>{p.postingType === "M" ? "Main" : "Additional"}</td>
                                <td>
                                  {p.officeType === "CI"
                                    ? "Circle"
                                    : p.officeType === "CH"
                                      ? "Charge"
                                      : p.officeType === "OF"
                                        ? "Office"
                                        : p.officeType}
                                </td>
                                <td>{p.officeName}</td>
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={selectedPostings.includes(key)}
                                    onChange={() => togglePosting(p.postingType, p.officeId)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-muted">No postings assigned.</div>
                    )}
                  </Card.Body>
                </Collapse>
              </Card>

              {/* Modules Section */}
              <Card className="mb-3 shadow-sm border-0 rounded-3">
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => setOpenModules(!openModules)}
                  style={headerStyle}
                >
                  <span>Modules</span>
                  {openModules ? <FaChevronUp /> : <FaChevronDown />}
                </Card.Header>
                <Collapse in={openModules}>
                  <Card.Body>
                    {assignedProjects.length ? (
                      <Table bordered hover responsive size="sm" className="align-middle text-center">
                        <thead className="table-light">
                          <tr>
                            <th>Module Name</th>
                            <th>Role</th>
                            <th>Select</th> {/* Checkbox last */}
                          </tr>
                        </thead>
                        <tbody>
                          {assignedProjects.map((m, idx) => (
                            <tr key={idx}>
                              <td>{m.projectName}</td>
                              <td>{m.roleName}</td>
                              <td>
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedProjects.includes(m.projectId)}
                                  onChange={() => toggleProject(m.projectId)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-muted">No modules assigned.</div>
                    )}
                  </Card.Body>
                </Collapse>
              </Card>


              {/* Remarks Section */}
              <Card className="shadow-sm border-0 rounded-3 mb-3">
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => setOpenRemarks(!openRemarks)}
                  style={headerStyle}
                >
                  <span>Remarks</span>
                  {openRemarks ? <FaChevronUp /> : <FaChevronDown />}
                </Card.Header>
                <Collapse in={openRemarks}>
                  <Card.Body>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter remarks..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </Card.Body>
                </Collapse>
              </Card>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-light border-top rounded-bottom">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Close
          </Button>
          <Button variant="danger" onClick={handleRelease} disabled={saving || loading}>
            {saving ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaExclamationTriangle className="me-1" />
            )}
            Release Selected
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Release</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to release <strong>{userDetails.fullName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRelease} disabled={saving}>
            Release
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReleaseModal;
