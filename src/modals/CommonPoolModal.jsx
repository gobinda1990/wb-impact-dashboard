import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  Form,
  Card,
  Dropdown,
  FormControl,
  Row,
  Col,
  Table,
  Alert,
  Collapse,
  Spinner,
} from "react-bootstrap";
import {
  FaBuilding,
  FaUserPlus,
  FaUserTie,
  FaIdCard,
  FaProjectDiagram,
  FaEnvelope,
  FaPhone,
  FaExclamationCircle,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiSave, FiXCircle, FiPlus, FiTrash2 } from "react-icons/fi";

import {
  fetchCurrentUser,
  fetchCircles,
  fetchCharges,
  fetchOffices,
  fetchProjects,
  fetchRoles,
  assignRolesAndProjects,
} from "../services/userService";

const CommonPoolModal = ({ show, onClose, onComplete, user }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [circles, setCircles] = useState([]);
  const [charges, setCharges] = useState([]);
  const [offices, setOffices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);

  const [postingType, setPostingType] = useState("");
  const [selectedCircles, setSelectedCircles] = useState([]);
  const [selectedCharges, setSelectedCharges] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [moduleRows, setModuleRows] = useState([{ projectId: "", roleId: "" }]);

  const [searchCircle, setSearchCircle] = useState("");
  const [searchCharge, setSearchCharge] = useState("");
  const [searchOffice, setSearchOffice] = useState("");
  const [searchModule, setSearchModule] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [openEmployee, setOpenEmployee] = useState(true);
    const [openPosting, setOpenPosting] = useState(true);
    const [openModules, setOpenModules] = useState(true);

  // ---------------- Load Data ----------------
  useEffect(() => {
    if (show && user) loadData();
  }, [show, user]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [current, c, ch, o, p, r] = await Promise.all([
        fetchCurrentUser(),
        fetchCircles(),
        fetchCharges(),
        fetchOffices(),
        fetchProjects(),
        fetchRoles(),
      ]);

      setCurrentUser(current);

      let roleFilteredCircles = c || [];
      let roleFilteredCharges = ch || [];
      let roleFilteredOffices = o || [];

      // Apply Role-based Restrictions
      if (current.role?.includes("Super Admin")) {
        // Full access
      } else if (current.role?.includes("Admin")) {
        if (current.postingType === "CI") {
          roleFilteredCircles = c.filter((circle) =>
            current.circleCds?.includes(circle.circleCd)
          );
          roleFilteredCharges = ch;
          roleFilteredOffices = [];
        } else if (current.postingType === "CH") {
          roleFilteredCharges = ch.filter((charge) =>
            current.chargeCds?.includes(charge.chargeCd)
          );
          roleFilteredOffices = [];
          roleFilteredCircles = [];
        } else if (current.postingType === "OF") {
          roleFilteredOffices = o.filter((office) =>
            current.officeCds?.includes(office.officeCd)
          );
          roleFilteredCircles = [];
          roleFilteredCharges = [];
        }
      }

      setCircles(roleFilteredCircles);
      setCharges(roleFilteredCharges);
      setOffices(roleFilteredOffices);
      setProjects(p || []);
      setRoles(r || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load modal data.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Filters ----------------
  const filteredCircles = useMemo(
    () =>
      circles.filter((c) =>
        (c.circleNm || "")
          .toLowerCase()
          .includes((searchCircle || "").toLowerCase())
      ),
    [circles, searchCircle]
  );

  const filteredCharges = useMemo(
    () =>
      charges.filter((c) =>
        (c.chargeNm || "")
          .toLowerCase()
          .includes((searchCharge || "").toLowerCase())
      ),
    [charges, searchCharge]
  );

  const filteredOffices = useMemo(
    () =>
      offices.filter((o) =>
        (o.officeNm || "")
          .toLowerCase()
          .includes((searchOffice || "").toLowerCase())
      ),
    [offices, searchOffice]
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        (p.projectName || "")
          .toLowerCase()
          .includes((searchModule || "").toLowerCase())
      ),
    [projects, searchModule]
  );

  const filteredRoles = useMemo(
    () =>
      roles.filter((r) =>
        (r.roleName || "").toLowerCase().includes((searchRole || "").toLowerCase())
      ),
    [roles, searchRole]
  );

  // ---------------- First row auto project selection & default role ----------------
  useEffect(() => {
    if (filteredProjects.length && moduleRows.length > 0 && roles.length > 0) {
      setModuleRows((prev) => {
        const updated = [...prev];
        if (!updated[0].projectId) {
          updated[0].projectId = filteredProjects[0].projectId; // first project
        }
        if (!updated[0].roleId) {
          const userRole = roles.find((r) => r.roleName === "User");
          updated[0].roleId = userRole ? userRole.roleId : "";
        }
        return updated;
      });
    }
  }, [filteredProjects, roles]);

  // ---------------- Selections ----------------
  const toggleCircle = (id) =>
    setSelectedCircles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleCharge = (id) =>
    setSelectedCharges((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleOffice = (id) =>
    setSelectedOffices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAddRow = () =>
    setModuleRows([...moduleRows, { projectId: "", roleId: "" }]);
  const handleDeleteRow = (index) =>
    setModuleRows(moduleRows.filter((_, i) => i !== index));

  // ---------------- Save ----------------
  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const validModules = moduleRows.filter((m) => m.projectId && m.roleId);
      const postingIds =
        postingType === "CI"
          ? selectedCircles
          : postingType === "CH"
          ? selectedCharges
          : selectedOffices;

      if (!postingType) throw new Error("Please select a posting type.");
      if (postingIds.length === 0)
        throw new Error("Please select at least one posting location.");
      if (validModules.length === 0)
        throw new Error("Please assign at least one module and role.");

      const payload = {
        hrmsCode: user.hrmsCode,
        postingType,
        postingIds,
        modules: validModules.map((m) => ({
          projectId: m.projectId,
          roleId: m.roleId,
        })),
      };

      const res = await assignRolesAndProjects(payload);

      if (res.success) {
        setSuccess("User assigned successfully!");
        setTimeout(() => {
          setSuccess("");
          onClose();
          onComplete?.();
        }, 1500);
      } else {
        throw new Error(res.message || "Failed to assign user.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Role-based PostingType ----------------
  const getPostingTypeOptions = () => {
    if (!currentUser) return [];

    if (currentUser.role?.includes("Super Admin"))
      return [
        { value: "CI", label: "Circle" },
        { value: "CH", label: "Charge" },
        { value: "OF", label: "Office" },
      ];

    if (currentUser.role?.includes("Admin") && currentUser.postingType === "CI")
      return [
        { value: "CI", label: "Circle" },
        { value: "CH", label: "Charge" },
      ];

    if (currentUser.role?.includes("Admin") && currentUser.postingType === "CH")
      return [{ value: "CH", label: "Charge" }];

    if (currentUser.role?.includes("Admin") && currentUser.postingType === "OF")
      return [{ value: "OF", label: "Office" }];

    return [];
  };

  const cardHeaderStyle = {
    background: "linear-gradient(90deg,#002147,#004b8d)",
    color: "white",
    fontWeight: 600,
  };
  const cardBodyStyle = {
    backgroundColor: "#f1f6fc",
    borderRadius: "0 0 10px 10px",
  };
  const requiredStyle = {
    borderColor: "#dc3545",
    boxShadow: "0 0 0 0.15rem rgba(220,53,69,.25)",
  };

  // ---------------- Render ----------------
  if (loading) {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3 text-muted fw-semibold">Loading data...</div>
        </Modal.Body>
      </Modal>
    );
  }

  if (!user) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      backdrop="static"
      className="common-pool-modal"
    >
      {/* HEADER */}
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(90deg,#002147,#004b8d)",
          color: "white",
          borderBottom: "none",
        }}
      >
        <Modal.Title className="fw-semibold">
          <FaUserPlus className="me-2" /> Assign User – {user.fullName}
        </Modal.Title>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body style={{ backgroundColor: "#f9fbfd" }}>
        {/* Alerts */}
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
            className="mb-3 shadow-sm border-0"
          >
            <FaExclamationCircle className="me-2" />
            <strong>{error}</strong>
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccess("")}
            className="mb-3 shadow-sm border-0"
          >
            <FaCheckCircle className="me-2" />
            <strong>{success}</strong>
          </Alert>
        )}

        {/* Employee Details */}
        {/* Employee Section */}
                <Card className="mb-3 shadow-sm border-0 rounded-3">
                  <Card.Header
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => setOpenEmployee(!openEmployee)}
                    style={{ cursor: "pointer", background: "#004b8d", color: "white" }}
                  >
                    <span><FaIdCard className="me-2" /> Employee Details</span>
                    {openEmployee ? <FaChevronUp /> : <FaChevronDown />}
                  </Card.Header>
                  <Collapse in={openEmployee}>
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={3} className="text-center">
                          <div className="p-2 rounded-circle border border-3 border-primary d-inline-block bg-white" style={{ width: 110, height: 110 }}>
                            <img src={user?.imageurl || "/images/defaultavatar.png"} alt="Profile" className="rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div className="mt-2 fw-semibold text-primary small">{user?.fullName}</div>
                        </Col>
                        <Col md={9}>
                          <Row className="g-3">
                            {[{icon:FaIdCard,label:"HRMS Code",value:user?.hrmsCode},{icon:FaUserTie,label:"Designation",value:user?.desigName},{icon:FaEnvelope,label:"Email",value:user?.email},{icon:FaPhone,label:"Phone",value:user?.phoneNo}].map((info,idx)=>(
                              <Col md={6} key={idx}>
                                <div className="bg-white p-2 rounded shadow-sm">
                                  <div className="text-muted small mb-1"><info.icon className="me-1 text-primary"/> {info.label}</div>
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

        {/* Posting Details */}
       <Card className="mb-3 shadow-sm border-0 rounded-3">
         <Card.Header
                     className="d-flex justify-content-between align-items-center"
                     onClick={() => setOpenPosting(!openPosting)}
                     style={{ cursor: "pointer", background: "#004b8d", color: "white" }}
                   >
                     <span><FaBuilding className="me-2"/> Posting Details</span>
                     {openPosting ? <FaChevronUp /> : <FaChevronDown />}
                   </Card.Header>
                    <Collapse in={openPosting}>
          <Card.Body style={cardBodyStyle}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-semibold">
                  Office Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={postingType}
                  onChange={(e) => setPostingType(e.target.value)}
                  style={!postingType ? requiredStyle : {}}
                >
                  <option value="">Select Type</option>
                  {getPostingTypeOptions().map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Dynamic Posting Fields */}
              {postingType === "CI" && (
                <Col md={6}>
                  <Form.Label>Select Circles</Form.Label>
                  <Dropdown className="w-100">
                    <Dropdown.Toggle
                      variant="outline-primary"
                      className="w-100 text-start shadow-sm"
                    >
                      {selectedCircles.length
                        ? `${selectedCircles.length} Selected`
                        : "Select Circles"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: 250, overflowY: "auto" }}>
                      <div className="px-2 py-2">
                        <FormControl
                          placeholder="Search circles..."
                          value={searchCircle}
                          onChange={(e) => setSearchCircle(e.target.value)}
                          className="mb-2"
                        />
                        {filteredCircles.map((c) => (
                          <Form.Check
                            key={c.circleCd}
                            type="checkbox"
                            label={c.circleNm}
                            checked={selectedCircles.includes(c.circleCd)}
                            onChange={() => toggleCircle(c.circleCd)}
                          />
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}

              {postingType === "CH" && (
                <Col md={6}>
                  <Form.Label>Select Charges</Form.Label>
                  <Dropdown className="w-100">
                    <Dropdown.Toggle
                      variant="outline-primary"
                      className="w-100 text-start shadow-sm"
                    >
                      {selectedCharges.length
                        ? `${selectedCharges.length} Selected`
                        : "Select Charges"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: 250, overflowY: "auto" }}>
                      <div className="px-2 py-2">
                        <FormControl
                          placeholder="Search charges..."
                          value={searchCharge}
                          onChange={(e) => setSearchCharge(e.target.value)}
                          className="mb-2"
                        />
                        {filteredCharges.map((c) => (
                          <Form.Check
                            key={c.chargeCd}
                            type="checkbox"
                            label={c.chargeNm}
                            checked={selectedCharges.includes(c.chargeCd)}
                            onChange={() => toggleCharge(c.chargeCd)}
                          />
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}

              {postingType === "OF" && (
                <Col md={6}>
                  <Form.Label>Select Offices</Form.Label>
                  <Dropdown className="w-100">
                    <Dropdown.Toggle
                      variant="outline-primary"
                      className="w-100 text-start shadow-sm"
                    >
                      {selectedOffices.length
                        ? `${selectedOffices.length} Selected`
                        : "Select Offices"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: 250, overflowY: "auto" }}>
                      <div className="px-2 py-2">
                        <FormControl
                          placeholder="Search offices..."
                          value={searchOffice}
                          onChange={(e) => setSearchOffice(e.target.value)}
                          className="mb-2"
                        />
                        {filteredOffices.map((o) => (
                          <Form.Check
                            key={o.officeCd}
                            type="checkbox"
                            label={o.officeNm}
                            checked={selectedOffices.includes(o.officeCd)}
                            onChange={() => toggleOffice(o.officeCd)}
                          />
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}
            </Row>
          </Card.Body>
          </Collapse>
        </Card>

        {/* Module & Role Assignment */}
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Header
            style={cardHeaderStyle}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <FaProjectDiagram className="me-2 text-success" /> Module & Role Assignment
            </span>
            <Button
              size="sm"
              variant="light"
              className="fw-semibold text-primary border-0"
              onClick={handleAddRow}
            >
              <FiPlus className="me-1" /> Add Row
            </Button>
          </Card.Header>
          <Card.Body style={cardBodyStyle}>
            <Table bordered hover responsive size="sm" className="align-middle">
              <thead className="table-light text-center">
                <tr>
                  <th>Module Name</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {moduleRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <Form.Select
                        value={row.projectId}
                        onChange={(e) => {
                          const updated = [...moduleRows];
                          updated[idx].projectId = e.target.value;
                          setModuleRows(updated);
                        }}
                        disabled={idx === 0} // first row project not editable
                      >
                        <option value="">Select Module</option>
                        {filteredProjects.map((p) => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.projectName}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Select
                        value={row.roleId}
                        onChange={(e) => {
                          const updated = [...moduleRows];
                          updated[idx].roleId = e.target.value;
                          setModuleRows(updated);
                        }}
                      >
                        <option value="">Select Role</option>
                        {filteredRoles.map((r) => (
                          <option key={r.roleId} value={r.roleId}>
                            {r.roleName}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteRow(idx)}
                        disabled={idx === 0} // first row cannot be deleted
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer className="bg-light border-top rounded-bottom">
        <Button variant="secondary" onClick={onClose}>
          <FiXCircle className="me-1" /> Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" /> Saving...
            </>
          ) : (
            <>
              <FiSave className="me-1" /> Save
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommonPoolModal;
