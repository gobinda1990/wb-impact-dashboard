import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Dropdown,
  FormControl,
  Alert
} from "react-bootstrap";
import {
  FaUserEdit,
  FaUserTie,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaUserCog,
  FaProjectDiagram
} from "react-icons/fa";
import { FiSave, FiXCircle } from "react-icons/fi";

const UserModal = ({
  tab,
  selectedUser,
  showModal,
  setShowModal,
  selectedCharge,
  setSelectedCharge,
  selectedCircle,
  setSelectedCircle,
  selectedRoles,
  setSelectedRoles,
  selectedProjects,
  setSelectedProjects,
  selectedOffices,
  setSelectedOffices,
  selectedOfficeId,
  setSelectedOfficeId,
  charges,
  circles,
  offices,
  roles,
  filteredProjects,
  filteredOffices,
  projectSearch,
  setProjectSearch,
  officeSearch,
  setOfficeSearch,
  toggleProject,
  toggleOffice,
  getProjectName,
  getOfficeName,
  handleSave
}) => {
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("info");

  const handleModalSave = async () => {
    const result = await handleSave();
    if (result.success) {
      setModalMessage(result.message);
      setModalMessageType("success");
      setTimeout(() => setShowModal(false), 1500);
    } else {
      setModalMessage(result.message);
      setModalMessageType("danger");
    }
  };

  /* ---------------- Determine role-based behavior ---------------- */
  const selectedRoleObj =
    roles.find((r) => r.roleId === selectedRoles[0]) || {};
  const selectedRoleName = (selectedRoleObj.roleName || "").toLowerCase();

  const isCircleApprover = selectedRoleName.includes("circle approver");
  const isChargeApprover = selectedRoleName.includes("charge approver");

  const disableField = (type) => {
    if (tab === "commonpool") {
      // Commonpool logic: role editable; circle/charge conditional
      if (type === "role") return false;
      if (type === "circle") return !isCircleApprover;
      if (type === "charge") return !isChargeApprover;
      return false;
    }

    // Assigned / AdditionalPostings logic
    if (["assigned", "additionalPostings"].includes(tab)) {
      if (["circle", "charge", "role"].includes(type)) return true;
      return !["projects", "offices"].includes(type);
    }

    return true;
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRoles(newRole ? [newRole] : []);
    setSelectedCircle("");
    setSelectedCharge("");
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(90deg,#002147,#004b8d)",
          color: "white"
        }}
      >
        <Modal.Title>
          {tab === "commonpool" ? (
            <>
              <FaUserEdit className="me-2" /> Edit User –{" "}
              {selectedUser.fullName}
            </>
          ) : (
            <>
              <FaUserTie className="me-2" /> Edit Projects & Postings –{" "}
              {selectedUser.fullName}
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        {modalMessage && (
          <Alert variant={modalMessageType} className="py-2">
            {modalMessage}
          </Alert>
        )}

        <Form>
          {/* Basic Info */}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>
                <FaIdCard className="me-1 text-primary" /> HRMS Code
              </Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.hrmsCode}
                readOnly
                disabled
                className="bg-light"
              />
            </div>
            <div className="col-md-4">
              <Form.Label>
                <FaEnvelope className="me-1 text-primary" /> Email
              </Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.email}
                readOnly
                disabled
                className="bg-light"
              />
            </div>
            <div className="col-md-4">
              <Form.Label>
                <FaPhone className="me-1 text-primary" /> Phone
              </Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.phoneNo || "-"}
                readOnly
                disabled
                className="bg-light"
              />
            </div>
          </div>

          {/* Role — only show in commonpool */}
          {tab === "commonpool" && (
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Label>
                  <FaUserCog className="me-1 text-primary" /> Role
                </Form.Label>
                <Form.Select
                  value={selectedRoles[0] || ""}
                  onChange={handleRoleChange}
                  disabled={disableField("role")}
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.roleName}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          )}

          {/* Circle & Charge */}
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Label>
                <FaBuilding className="me-1 text-primary" /> Circle
              </Form.Label>
              <Form.Select
                value={selectedCircle || ""}
                onChange={(e) => setSelectedCircle(e.target.value)}
                disabled={disableField("circle")}
              >
                <option value="">Select Circle</option>
                {circles.map((c) => (
                  <option key={c.circleCd} value={c.circleCd}>
                    {c.circleNm}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-6">
              <Form.Label>
                <FaUserTie className="me-1 text-primary" /> Charge
              </Form.Label>
              <Form.Select
                value={selectedCharge || ""}
                onChange={(e) => setSelectedCharge(e.target.value)}
                disabled={disableField("charge")}
              >
                <option value="">Select Charge</option>
                {charges.map((c) => (
                  <option key={c.chargeCd} value={c.chargeCd}>
                    {c.chargeNm}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {/* Main Office */}
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Label>
                <FaBuilding className="me-1 text-primary" /> Main Office
              </Form.Label>
              <Form.Select
                value={selectedOfficeId || ""}
                onChange={(e) => setSelectedOfficeId(e.target.value)}
                disabled={disableField("office")}
              >
                <option value="">Select Office</option>
                {offices.map((o) => (
                  <option key={o.officeCd} value={o.officeCd}>
                    {o.officeNm}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {/* Projects */}
          <Form.Label>
            <FaProjectDiagram className="me-1 text-success" /> Modules
          </Form.Label>
          <Dropdown className="mb-3">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="w-100 text-start"
              disabled={disableField("projects")}
            >
              {selectedProjects.length
                ? selectedProjects.map((pid) => getProjectName(pid)).join(", ")
                : "Select Projects"}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{ maxHeight: "250px", overflowY: "auto", width: "100%" }}
            >
              <div className="px-2 py-2">
                <FormControl
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="mb-2"
                />
                {filteredProjects.map((p) => (
                  <Form.Check
                    key={p.projectId}
                    type="checkbox"
                    label={p.projectName}
                    checked={selectedProjects.includes(p.projectId)}
                    onChange={() => toggleProject(p.projectId)}
                    disabled={disableField("projects")}
                  />
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Additional Postings only for assigned/additionalPostings */}
          {tab !== "commonpool" && (
            <>
              <Form.Label>
                <FaBuilding className="me-1 text-success" /> Additional Postings
              </Form.Label>
              <Dropdown className="mb-3">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="w-100 text-start"
                  disabled={disableField("offices")}
                >
                  {selectedOffices.filter((o) => o !== selectedOfficeId).length
                    ? selectedOffices
                        .filter((o) => o !== selectedOfficeId)
                        .map((oid) => getOfficeName(oid))
                        .join(", ")
                    : "Select Additional Offices"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{ maxHeight: "250px", overflowY: "auto", width: "100%" }}
                >
                  <div className="px-2 py-2">
                    <FormControl
                      placeholder="Search offices..."
                      value={officeSearch}
                      onChange={(e) => setOfficeSearch(e.target.value)}
                      className="mb-2"
                    />
                    {filteredOffices
                      .filter((o) => o.officeCd !== selectedOfficeId)
                      .map((o) => (
                        <Form.Check
                          key={o.officeCd}
                          type="checkbox"
                          label={o.officeNm}
                          checked={selectedOffices.includes(o.officeCd)}
                          onChange={() => toggleOffice(o.officeCd)}
                          disabled={disableField("offices")}
                        />
                      ))}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          <FiXCircle className="me-1" /> Close
        </Button>
        <Button variant="primary" onClick={handleModalSave}>
          <FiSave className="me-1" /> Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
