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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaBuilding,
  FaUserPlus,
  FaIdCard,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaProjectDiagram,
  FaExclamationCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiTrash2, FiSave, FiXCircle, FiPlus } from "react-icons/fi";
import Select from "react-select";

import {
  fetchCurrentUser,
  fetchCircles,
  fetchCharges,
  fetchOffices,
  fetchUserDetails,
  fetchUserPostingDetails,
  fetchUserProjectDetails,
  fetchRoles,
  assignAddProjects,
  doReleaseEmp,
} from "../services/userService";

const AdditionalModal = ({ user, show, onClose, onComplete, projects = [] }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [existingPostings, setExistingPostings] = useState([]);
  const [newPostingRows, setNewPostingRows] = useState([{ postingType: "A", officeType: "", officeId: null }]);
  const [roles, setRoles] = useState([]);
  const [selectedModules, setSelectedModules] = useState([{ projectId: "", roleId: "" }]);
  const [assignedModules, setAssignedModules] = useState([]);
  const [selectedForRelease, setSelectedForRelease] = useState({ postings: [], modules: [] });
  const [confirmRelease, setConfirmRelease] = useState({ show: false });
  const [remarks, setRemarks] = useState("");
  const [circles, setCircles] = useState([]);
  const [charges, setCharges] = useState([]);
  const [offices, setOffices] = useState([]);

  const [openEmployee, setOpenEmployee] = useState(true);
  const [openPosting, setOpenPosting] = useState(true);
  const [openModules, setOpenModules] = useState(true);
  const [openRemarks, setOpenRemarks] = useState(false);

  const hrmsCode = user?.hrmsCode;

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "38px",
      height: "38px",
      borderRadius: ".375rem",
      borderColor: "#ced4da",
      boxShadow: "none",
      fontSize: "0.875rem",
    }),
    valueContainer: (provided) => ({ ...provided, height: "38px", padding: "0 0.75rem" }),
    input: (provided) => ({ ...provided, margin: "0px", padding: "0px" }),
    indicatorsContainer: (provided) => ({ ...provided, height: "38px" }),
    placeholder: (provided) => ({ ...provided, fontSize: "0.875rem", color: "#6c757d" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  // Load initial data
  useEffect(() => {
    if (!show || !hrmsCode) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          current,
          c,
          ch,
          o,
          details,
          postings,
          projectList,
          roleList,
        ] = await Promise.all([
          fetchCurrentUser(),
          fetchCircles(),
          fetchCharges(),
          fetchOffices(),
          fetchUserDetails(hrmsCode),
          fetchUserPostingDetails(hrmsCode),
          fetchUserProjectDetails(hrmsCode),
          fetchRoles(),
        ]);

        setCurrentUser(current || {});
        setUserDetails(details || {});
        setExistingPostings(postings || []);
        setAssignedModules(projectList || []);
        setRoles(roleList || []);

        let roleFilteredCircles = c || [];
        let roleFilteredCharges = ch || [];
        let roleFilteredOffices = o || [];

        if (current.role?.includes("Super Admin")) {
        } else if (current.role?.includes("Admin")) {
          if (current.postingType === "CI") {
            roleFilteredCircles = c.filter((circle) => current.circleCds?.includes(circle.circleCd));
            roleFilteredCharges = ch;
            roleFilteredOffices = [];
          } else if (current.postingType === "CH") {
            roleFilteredCharges = ch.filter((charge) => current.chargeCds?.includes(charge.chargeCd));
            roleFilteredOffices = [];
            roleFilteredCircles = [];
          } else if (current.postingType === "OF") {
            roleFilteredOffices = o.filter((office) => current.officeCds?.includes(office.officeCd));
            roleFilteredCircles = [];
            roleFilteredCharges = [];
          }
        }

        setCircles(roleFilteredCircles);
        setCharges(roleFilteredCharges);
        setOffices(roleFilteredOffices);
      } catch (err) {
        console.error(err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [show, hrmsCode]);

  useEffect(() => {
    if (!show) {
      setUserDetails(null);
      setExistingPostings([]);
      setNewPostingRows([{ postingType: "A", officeType: "", officeId: null }]);
      setSelectedModules([{ projectId: "", roleId: "" }]);
      setRoles([]);
      setError("");
      setSuccess("");
      setSelectedForRelease({ postings: [], modules: [] });
      setConfirmRelease({ show: false });
      setRemarks("");
    }
  }, [show]);

  const reloadAssignments = async () => {
    if (!hrmsCode) return;
    try {
      const [postings, modules] = await Promise.all([
        fetchUserPostingDetails(hrmsCode),
        fetchUserProjectDetails(hrmsCode),
      ]);
      setExistingPostings(postings || []);
      setAssignedModules(modules || []);
    } catch (err) {
      console.error(err);
      setError("Failed to reload assignments.");
    }
  };
  // Select all toggle functions
  const toggleSelectAll = (type, checked) => {
    setSelectedForRelease((prev) => {
      const updated = { ...prev };
      if (checked) {
        if (type === "postings") {
          updated.postings = existingPostings.map((p) => p.officeId);
        } else if (type === "modules") {
          updated.modules = assignedModules.map((m) => m.projectId);
        }
      } else {
        updated[type] = [];
      }
      return updated;
    });
  };

  // Helper to check if all are selected
  const isAllSelected = (type) => {
    if (type === "postings") return existingPostings.length > 0 && selectedForRelease.postings.length === existingPostings.length;
    if (type === "modules") return assignedModules.length > 0 && selectedForRelease.modules.length === assignedModules.length;
    return false;
  };

  const toggleSelectForRelease = (type, id) => {
    setSelectedForRelease((prev) => {
      const updated = { ...prev };
      const list = new Set(updated[type]);
      if (list.has(id)) list.delete(id);
      else list.add(id);
      updated[type] = Array.from(list);
      return updated;
    });
  };

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

  const getAvailableList = (officeType) =>
    officeType === "CI" ? circles : officeType === "CH" ? charges : officeType === "OF" ? offices : [];

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const validModules = selectedModules.filter((m) => m.projectId && m.roleId);
      const validPostings = newPostingRows.filter((p) => p.postingType && p.officeType && p.officeId);

      if (!validModules.length && !validPostings.length)
        throw new Error("Please add at least one posting or module.");

      const payload = {
        hrmsCode,
        postings: validPostings.map((p) => ({
          postingType: p.postingType,
          officeType: p.officeType,
          officeId: p.officeId,
        })),
        modules: validModules.map((m) => ({ projectId: m.projectId, roleId: m.roleId })),
      };

      const res = await assignAddProjects(payload);
      if (res.success) {
        setSuccess("✅ Changes saved successfully!");
        await reloadAssignments();
        if (onComplete) onComplete();
        setNewPostingRows([{ postingType: "A", officeType: "", officeId: null }]);
        setSelectedModules([{ projectId: "", roleId: "" }]);
        setSelectedForRelease({ postings: [], modules: [] });
        setTimeout(() => setSuccess(""), 2000);
      } else throw new Error(res.message || "Failed to assign projects.");
    } catch (err) {
      setError(err.message || "Failed to save data.");
    } finally {
      setSaving(false);
    }
  };

  const handleReleaseConfirm = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        hrmsCode,
        remarks,
        releasePostings: existingPostings
          .filter((p) => selectedForRelease.postings.includes(p.officeId))
          .map((p) => ({ postingType: p.postingType, officeType: p.officeType, officeId: p.officeId })),
        releaseProjects: assignedModules
          .filter((m) => selectedForRelease.modules.includes(m.projectId))
          .map((m) => ({ projectId: m.projectId, roleId: m.roleId })),
      };

      const res = await doReleaseEmp(payload);
      if (res.success) {
        setSuccess("✅ Selected items released successfully!");
        await reloadAssignments();
        if (onComplete) onComplete();
        setSelectedForRelease({ postings: [], modules: [] });
        setRemarks("");
        setConfirmRelease({ show: false });
        setTimeout(() => setSuccess(""), 2000);
      } else throw new Error(res.message || "❌ Failed to release selected items.");
    } catch (err) {
      setError(err.message || "❌ Error during bulk release.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3 text-muted fw-semibold">Loading user details...</div>
        </Modal.Body>
      </Modal>
    );

  const hasSelected = selectedForRelease.postings.length > 0 || selectedForRelease.modules.length > 0;
  const renderTooltip = (msg) => <Tooltip>{msg}</Tooltip>;

  return (
    <Modal show={show} onHide={onClose} size="xl" centered backdrop="static">
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{
          background: "linear-gradient(90deg, #004b8d, #007bff)",
          color: "white",
          borderBottom: "3px solid #007bff",
          fontWeight: "600",
          letterSpacing: "0.3px",
        }}
      >
        <Modal.Title className="d-flex align-items-center">
          <FaUserPlus className="me-2" /> Additional Posting – {userDetails?.fullName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f9fbfd" }}>
        {/* Employee Section */}
        <Card className="mb-3 shadow-sm border-0 rounded-3">
          <Card.Header className="d-flex justify-content-between align-items-center" onClick={() => setOpenEmployee(!openEmployee)} style={{ cursor: "pointer", background: "#004b8d", color: "white" }}>
            <span><FaIdCard className="me-2" /> Employee Details</span>{openEmployee ? <FaChevronUp /> : <FaChevronDown />}
          </Card.Header>
          <Collapse in={openEmployee}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="text-center">
                  <div className="p-2 rounded-circle border border-3 border-primary bg-white d-inline-block" style={{ width: 110, height: 110 }}>
                    <img src={userDetails?.imageurl || "/images/defaultavatar.png"} alt="Profile" className="rounded-circle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="mt-2 fw-semibold text-primary small">{userDetails?.fullName}</div>
                </Col>
                <Col md={9}>
                  <Row className="g-3">
                    {[{ icon: FaIdCard, label: "HRMS Code", value: userDetails?.hrmsCode }, { icon: FaUserTie, label: "Designation", value: userDetails?.desigName }, { icon: FaEnvelope, label: "Email", value: userDetails?.email }, { icon: FaPhone, label: "Phone", value: userDetails?.phoneNo }].map((info, idx) => (
                      <Col md={6} key={idx}>
                        <div className="bg-white p-2 rounded shadow-sm">
                          <div className="text-muted small mb-1"><info.icon className="me-1 text-primary" />{info.label}</div>
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

        {/* Posting Section */}
        <Card className="mb-3 shadow-sm border-0 rounded-3">
          <Card.Header className="d-flex justify-content-between align-items-center" onClick={() => setOpenPosting(!openPosting)} style={{ cursor: "pointer", background: "#004b8d", color: "white" }}>
            <span><FaBuilding className="me-2" /> Posting Details</span>{openPosting ? <FaChevronUp /> : <FaChevronDown />}
          </Card.Header>
          <Collapse in={openPosting}>
            <Card.Body>
              <OverlayTrigger placement="top" overlay={renderTooltip("Add new posting")}>
                <Button size="sm" variant="primary" className="mb-2" onClick={() => setNewPostingRows([...newPostingRows, { postingType: "A", officeType: "", officeId: null }])}><FaUserPlus className="me-1" /> Add Posting</Button>
              </OverlayTrigger>
              <Table bordered hover striped responsive size="sm" className="align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Posting Type</th>
                    <th>Office Type</th>
                    <th>Office Name</th>
                    <th> Action{" "}
                      <Form.Check
                        type="checkbox"
                        className="ms-1"
                        checked={isAllSelected("postings")}
                        onChange={(e) => toggleSelectAll("postings", e.target.checked)}
                      /></th>
                  </tr></thead>
                <tbody>
                  {existingPostings.map((p, idx) => (
                    <tr key={`exist-${idx}`} style={{ backgroundColor: "#eef6ff" }}>
                      <td><Form.Select value={p.postingType} disabled><option>{p.postingType === "M" ? "Main" : "Additional"}</option></Form.Select></td>
                      <td><Form.Select value={p.officeType} disabled><option>{p.officeType === "CI" ? "Circle" : p.officeType === "CH" ? "Charge" : p.officeType === "OF" ? "Office" : p.officeType}</option></Form.Select></td>
                      <td><Form.Select value={p.officeId} disabled><option>{p.officeName}</option></Form.Select></td>
                      <td><Form.Check type="checkbox" checked={selectedForRelease.postings.includes(p.officeId)} onChange={() => toggleSelectForRelease("postings", p.officeId)} /></td>
                    </tr>
                  ))}
                  {newPostingRows.map((row, idx) => {
                    const postingOptions = getPostingTypeOptions();
                    const availableList = getAvailableList(row.officeType);
                    return (
                      <tr key={`new-${idx}`}>
                        <td><Form.Select value="A" disabled><option value="A">Additional</option></Form.Select></td>
                        <td><Form.Select value={row.officeType} onChange={e => { const u = [...newPostingRows]; u[idx].officeType = e.target.value; u[idx].officeId = null; setNewPostingRows(u); }}><option value="">Select Office Type</option>{postingOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</Form.Select></td>
                        <td style={{ minWidth: "200px" }}>{row.officeType && <Select placeholder="Select Office..." value={row.officeId ? { value: row.officeId, label: availableList.find(o => (o.circleCd || o.chargeCd || o.officeId || o.officeCd) === row.officeId)?.circleNm || availableList.find(o => (o.circleCd || o.chargeCd || o.officeId || o.officeCd) === row.officeId)?.chargeNm || availableList.find(o => (o.circleCd || o.chargeCd || o.officeId || o.officeCd) === row.officeId)?.officeNm || availableList.find(o => (o.circleCd || o.chargeCd || o.officeId || o.officeCd) === row.officeId)?.officeName } : null} onChange={s => { const u = [...newPostingRows]; u[idx].officeId = s ? s.value : null; setNewPostingRows(u); }} options={availableList.map(o => ({ value: o.circleCd || o.chargeCd || o.officeId || o.officeCd, label: o.circleNm || o.chargeNm || o.officeNm || o.officeName }))} isClearable isSearchable styles={customSelectStyles} menuPortalTarget={document.body} menuPosition="fixed" />}</td>
                        <td><Button variant="outline-danger" size="sm" onClick={() => setNewPostingRows(newPostingRows.filter((_, i) => i !== idx))}><FiTrash2 /> Remove</Button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Collapse>
        </Card>

        {/* Modules Section */}
        <Card className="mb-3 shadow-sm border-0 rounded-3">
          <Card.Header className="d-flex justify-content-between align-items-center" onClick={() => setOpenModules(!openModules)} style={{ cursor: "pointer", background: "#004b8d", color: "white" }}>
            <span><FaProjectDiagram className="me-2" /> Modules & Roles Assignment</span>{openModules ? <FaChevronUp /> : <FaChevronDown />}
          </Card.Header>
          <Collapse in={openModules}>
            <Card.Body>
              <OverlayTrigger placement="top" overlay={renderTooltip("Add new module")}>
                <Button size="sm" variant="primary" className="mb-2"
                  onClick={() => {
                    const userRole = roles.find(r => r.roleName === "User");
                    setSelectedModules([...selectedModules, {
                      projectId: "",
                      roleId: userRole ? userRole.roleId : ""
                    }]);
                  }}>
                  <FiPlus /> Add Row
                </Button>
              </OverlayTrigger>

              <Table bordered hover striped size="sm" className="align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Module</th>
                    <th>Role</th>
                    <th> Action{" "}
                      <Form.Check
                        type="checkbox"
                        className="ms-1"
                        checked={isAllSelected("modules")}
                        onChange={(e) => toggleSelectAll("modules", e.target.checked)}
                      /></th>
                  </tr>
                </thead>
                <tbody>
                  {assignedModules.map((mod, idx) => {
                    const project = projects.find(p => p.projectId === mod.projectId);
                    const moduleRoles = project?.roles?.length ? project.roles : roles;
                    return (
                      <tr key={`assigned-${idx}`} style={{ backgroundColor: "#eef6ff" }}>
                        <td><Form.Select value={mod.projectId} disabled><option>{project?.projectName || mod.projectName}</option></Form.Select></td>
                        <td><Form.Select value={mod.roleId} disabled><option>{moduleRoles.find(r => r.roleId === mod.roleId)?.roleName || "—"}</option></Form.Select></td>
                        <td><Form.Check type="checkbox" checked={selectedForRelease.modules.includes(mod.projectId)} onChange={() => toggleSelectForRelease("modules", mod.projectId)} /></td>
                      </tr>
                    )
                  })}
                  {selectedModules.map((mod, idx) => {
                    const takenIds = [...assignedModules.map(m => String(m.projectId)), ...selectedModules.filter((_, i) => i !== idx).map(m => String(m.projectId))];
                    const availableProjects = projects.filter(p => !takenIds.includes(String(p.projectId)) || String(p.projectId) === String(mod.projectId));
                    const selectedProject = projects.find(p => String(p.projectId) === String(mod.projectId));
                    const availableRoles = selectedProject?.roles?.length ? selectedProject.roles : roles;
                    return (
                      <tr key={`newmod-${idx}`}>
                        <td style={{ minWidth: "180px" }}><Select placeholder="Select Module..." value={mod.projectId ? { value: mod.projectId, label: selectedProject?.projectName } : null} onChange={s => { const u = [...selectedModules]; u[idx].projectId = s ? s.value : ""; u[idx].roleId = ""; setSelectedModules(u); }} options={availableProjects.map(p => ({ value: p.projectId, label: p.projectName }))} isClearable isSearchable styles={customSelectStyles} menuPortalTarget={document.body} menuPosition="fixed" /></td>
                        <td style={{ minWidth: "150px" }}><Select placeholder="Select Role..." value={mod.roleId ? { value: mod.roleId, label: availableRoles.find(r => String(r.roleId) === String(mod.roleId))?.roleName } : null} onChange={s => { const u = [...selectedModules]; u[idx].roleId = s ? s.value : ""; setSelectedModules(u); }} options={availableRoles.map(r => ({ value: r.roleId, label: r.roleName }))} isClearable isSearchable styles={customSelectStyles} isDisabled={!mod.projectId} menuPortalTarget={document.body} menuPosition="fixed" /></td>
                        <td><Button variant="outline-danger" size="sm" onClick={() => setSelectedModules(selectedModules.filter((_, i) => i !== idx))}><FiTrash2 /> Remove</Button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Collapse>
        </Card>

        {/* Remarks Section */}
        <Card className="shadow-sm border-0 rounded-3 mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center" onClick={() => setOpenRemarks(!openRemarks)} style={{ cursor: "pointer", background: "#004b8d", color: "white" }}>
            <span>Release Remarks (optional)</span>{openRemarks ? <FaChevronUp /> : <FaChevronDown />}
          </Card.Header>
          <Collapse in={openRemarks}>
            <Card.Body>
              <Form.Group>
                <Form.Control as="textarea" rows={3} placeholder="Enter remarks..." value={remarks} onChange={e => setRemarks(e.target.value)} />
              </Form.Group>
            </Card.Body>
          </Collapse>
        </Card>
        {error && <Alert variant="danger" dismissible onClose={() => setError("")}><FaExclamationCircle className="me-2" />{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className="bg-light border-top rounded-bottom">
        <Button variant="secondary" onClick={onClose} disabled={saving}><FiXCircle /> Close</Button>
        <Button variant="danger" onClick={() => setConfirmRelease({ show: true })} disabled={!hasSelected || saving}><FiTrash2 className="me-1" /> Release Selected</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : <><FiSave /> Save</>}</Button>
      </Modal.Footer>

      {/* Confirm Release Modal */}
      <Modal show={confirmRelease.show} onHide={() => setConfirmRelease({ show: false })} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Bulk Release</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to release <strong>{selectedForRelease.postings.length + selectedForRelease.modules.length}</strong> selected item(s)?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmRelease({ show: false })}>Cancel</Button>
          <Button variant="danger" onClick={handleReleaseConfirm} disabled={saving}>{saving ? "Releasing..." : "Release"}</Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default AdditionalModal;
