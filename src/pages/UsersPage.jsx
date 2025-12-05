import React, { useEffect, useState } from "react";
import { Tabs, Tab, Alert } from "react-bootstrap";
import { FaUserTie, FaUsers, FaUserCheck, FaBuilding } from "react-icons/fa";
import {
  fetchUsers,
  fetchAssignedUsers,
  fetchCharges,
  fetchCircles,
  fetchOffices,
  fetchProjects,
  fetchRoles,
  assignRolesAndProjects
} from "../services/userService";
import UserCardTable from "./UserCardTable";
import UserModal from "./UserModal";
import "./UsersPage.css";

/* ---------------------- UsersPage ---------------------- */
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [charges, setCharges] = useState([]);
  const [circles, setCircles] = useState([]);
  const [offices, setOffices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("commonpool");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState("");
  const [selectedCircle, setSelectedCircle] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [message, setMessage] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [officeSearch, setOfficeSearch] = useState("");

  /* ---------------- Load all required data ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, c, ci, o, p, r] = await Promise.all([
          fetchUsers(),
          fetchCharges(),
          fetchCircles(),
          fetchOffices(),
          fetchProjects(),
          fetchRoles()
        ]);

        setUsers(u || []);
        setFilteredUsers(u || []);
        setCharges(c || []);
        setCircles(ci || []);
        setOffices(o || []);
        setProjects(p || []);
        setRoles(Array.isArray(r) ? r : []);

        const au = await fetchAssignedUsers();
        setAssignedUsers(au || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load data. Please try again.");
      }
    };
    loadData();
  }, []);

  /* ---------------- Search Filter ---------------- */
  useEffect(() => {
    const term = (searchTerm || "").toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.fullName || "").toLowerCase().includes(term) ||
          (u.hrmsCode || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  /* ---------------- Handle Edit ---------------- */
  const handleEdit = (user) => {
    setSelectedUser(user);

    setSelectedCharge(user.chargeDet?.[0]?.chargeCd || "");
    setSelectedCircle(user.circleDet?.[0]?.circleCd || "");
    setSelectedRoles(user.role?.map((r) => r.roleId) || []);
    setSelectedProjects(user.projectIds?.map((p) => p.projectId) || []);
    setSelectedOffices(user.officeCds?.map((o) => o.officeCd) || []);
    setSelectedOfficeId(user.officeId || user.officeCds?.[0]?.officeCd || "");

    setProjectSearch("");
    setOfficeSearch("");
    setShowModal(true);
  };

  /* ---------------- Handle Save (AssignRequest DTO aligned) ---------------- */
  const handleSave = async () => {
    try {
      const assignData = {
        hrmsCode: selectedUser.hrmsCode,
        fullName: selectedUser.fullName,
        assignedBy: "",
        email: selectedUser.email,
        phoneNo: selectedUser.phoneNo || "",
        approverHrms: "",
        userIp: " ",
        role: selectedRoles.map((rid) => {
          const role = roles.find((r) => r.roleId === rid);
          return { roleId: rid, roleName: role?.roleName || "" };
        }),
        projectIds: selectedProjects.map((pid) => {
          const proj = projects.find((p) => p.projectId === pid);
          return { projectId: pid, projectName: proj?.projectName || "" };
        }),
        officeCds: selectedOffices.map((oid) => {
          const off = offices.find((o) => o.officeCd === oid);
          return { officeCd: oid, officeNm: off?.officeNm || "" };
        }),
        chargeDet: selectedCharge
          ? [
              {
                chargeCd: selectedCharge,
                chargeNm:
                  charges.find((c) => c.chargeCd === selectedCharge)?.chargeNm ||
                  ""
              }
            ]
          : [],
        circleDet: selectedCircle
          ? [
              {
                circleCd: selectedCircle,
                circleNm:
                  circles.find((c) => c.circleCd === selectedCircle)?.circleNm ||
                  ""
              }
            ]
          : []
      };

      await assignRolesAndProjects(assignData);

      const [refreshedUsers, refreshedAssigned] = await Promise.all([
        fetchUsers(),
        fetchAssignedUsers()
      ]);
      setUsers(refreshedUsers || []);
      setAssignedUsers(refreshedAssigned || []);

      return { success: true, message: " User updated successfully!" };
    } catch (err) {
      console.error("Save error:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          " Failed to update user. Please check your input and try again."
      };
    }
  };

  /* ---------------- Project & Office Toggles ---------------- */
  const toggleProject = (id) =>
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const toggleOffice = (id) =>
    setSelectedOffices((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );

  /* ---------------- Search Filters ---------------- */
  const filteredProjects = projects.filter((p) =>
    (p.projectName || "").toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredOffices = offices.filter((o) =>
    (o.officeNm || "").toLowerCase().includes(officeSearch.toLowerCase())
  );

  /* ---------------- Helpers ---------------- */
  const getProjectName = (id) =>
    projects.find((p) => p.projectId === id)?.projectName || id;

  const getOfficeName = (id) =>
    offices.find((o) => o.officeCd === id)?.officeNm || id;

  /* ---------------- UI ---------------- */
  return (
    <div className="container-fluid mt-4">
      <h3 className="text-primary fw-bold mb-3">
        <FaUserTie className="me-2" /> User Management
      </h3>

      {message && <Alert variant="info">{message}</Alert>}

      <Tabs activeKey={tab} onSelect={setTab} className="mb-4" fill>
        {/* Commonpool Tab */}
        <Tab
          eventKey="commonpool"
          title={
            <span>
              <FaUsers className="me-2" /> Commonpool
            </span>
          }
        >
          <UserCardTable
            title="Commonpool Users"
            users={filteredUsers.filter((u) => !u.role?.length)}
            handleEdit={handleEdit}
            tableType="commonpool"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        {/* Assigned Users Tab */}
        <Tab
          eventKey="assigned"
          title={
            <span>
              <FaUserCheck className="me-2" /> Assigned Users
            </span>
          }
        >
          <UserCardTable
            title="Assigned Users"
            users={assignedUsers}
            handleEdit={handleEdit}
            tableType="assigned"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        {/* Additional Postings Tab */}
        <Tab
          eventKey="additionalPostings"
          title={
            <span>
              <FaBuilding className="me-2" /> Additional Postings
            </span>
          }
        >
          <UserCardTable
            title="Assign Additional Postings"
            users={assignedUsers}
            handleEdit={handleEdit}
            tableType="additionalPostings"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>
      </Tabs>

      {showModal && selectedUser && (
        <UserModal
          tab={tab}
          selectedUser={selectedUser}
          showModal={showModal}
          setShowModal={setShowModal}
          selectedCharge={selectedCharge}
          setSelectedCharge={setSelectedCharge}
          selectedCircle={selectedCircle}
          setSelectedCircle={setSelectedCircle}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          selectedOffices={selectedOffices}
          setSelectedOffices={setSelectedOffices}
          selectedOfficeId={selectedOfficeId}
          setSelectedOfficeId={setSelectedOfficeId}
          charges={charges}
          circles={circles}
          offices={offices}
          roles={roles}
          filteredProjects={filteredProjects}
          filteredOffices={filteredOffices}
          projectSearch={projectSearch}
          setProjectSearch={setProjectSearch}
          officeSearch={officeSearch}
          setOfficeSearch={setOfficeSearch}
          toggleProject={toggleProject}
          toggleOffice={toggleOffice}
          getProjectName={getProjectName}
          getOfficeName={getOfficeName}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default UsersPage;
