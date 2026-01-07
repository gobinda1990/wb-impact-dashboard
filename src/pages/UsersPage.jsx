import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Tab, Alert, Spinner } from "react-bootstrap";
import { FaUsers, FaUserCheck, FaBuilding, FaUserTie } from "react-icons/fa";

import {
  fetchUsers,
  fetchAssignedUsers,
  fetchAllAssignedUsers,
  fetchCharges,
  fetchCircles,
  fetchOffices,
  fetchProjects,
  fetchRoles,
} from "../services/userService";

import UserCardTable from "../modals/UserCardTable";
import CommonPoolModal from "../modals/CommonPoolModal";
import AssignedModal from "../modals/AssignedModal";
import AdditionalModal from "../modals/AdditionalModal";
import ReleaseModal from "../modals/ReleaseModal";

const UsersPage = () => {
  const [tab, setTab] = useState("commonpool");
  const [additionalSubTab, setAdditionalSubTab] = useState("mainposting");

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [additionalUsers, setAdditionalUsers] = useState([]);
  const [charges, setCharges] = useState([]);
  const [circles, setCircles] = useState([]);
  const [offices, setOffices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const [selectedCommonUser, setSelectedCommonUser] = useState(null);
  const [selectedAssignedUser, setSelectedAssignedUser] = useState(null);
  const [selectedAdditionalUser, setSelectedAdditionalUser] = useState(null);

  const [showRelease, setShowRelease] = useState(false);
  const [userToRelease, setUserToRelease] = useState(null);

  // ---------- Load All Data ----------
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [u, au, aau, c, ci, o, p, r] = await Promise.all([
        fetchUsers(),
        fetchAssignedUsers(),
        fetchAllAssignedUsers(),
        fetchCharges(),
        fetchCircles(),
        fetchOffices(),
        fetchProjects(),
        fetchRoles(),
      ]);

      setUsers(u || []);
      setAssignedUsers(au || []);
      setAdditionalUsers(aau || []);
      setCharges(c || []);
      setCircles(ci || []);
      setOffices(o || []);
      setProjects(p || []);
      setRoles(r || []);
    } catch (err) {
      console.error("❌ Data load failed:", err);
      setAlertVariant("danger");
      setAlertMsg("⚠️ Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRelease = (user) => {
    setUserToRelease(user);
    setShowRelease(true);
  };

  const getProjectName = useCallback(
    (id) => projects.find((p) => p.projectId === id)?.projectName || "-",
    [projects]
  );

  const getOfficeName = useCallback(
    (id) => offices.find((o) => o.officeId === id)?.officeName || "-",
    [offices]
  );

  // Auto-dismiss alert
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  // ---------- Posting type detection ----------
  const getPostingType = (user) => {
    if (user?.postingType) return user.postingType;
    if (Array.isArray(user?.postings) && user.postings.length > 0) {
      const mainPosting = user.postings.find((p) => p.postingType === "M");
      const additionalPosting = user.postings.find((p) => p.postingType === "A");
      if (mainPosting) return "M";
      if (additionalPosting) return "A";
    }
    return null;
  };

  // ---------- Filter Main / Additional ----------
  const mainUsersFinal =
    additionalUsers.filter((u) => getPostingType(u) === "M").length > 0
      ? additionalUsers.filter((u) => getPostingType(u) === "M")
      : additionalUsers;

  const addUsersFinal =
    additionalUsers.filter((u) => getPostingType(u) === "A").length > 0
      ? additionalUsers.filter((u) => getPostingType(u) === "A")
      : additionalUsers;

  // ---------- UI ----------
  return (
    <div className="userpage-container fade-in position-relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 text-primary fw-semibold">Loading data...</div>
        </div>
      )}

      {/* Header */}
      <div className="userpage-header mb-4 d-flex align-items-center gap-2">
        <FaUserTie className="header-icon" />
        <h4>Employee Management</h4>
      </div>

      {/* Alert */}
      {alertMsg && (
        <Alert
          variant={alertVariant}
          onClose={() => setAlertMsg("")}
          dismissible
          className="shadow-sm fw-semibold"
        >
          {alertMsg}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs activeKey={tab} onSelect={setTab} className="modern-tabs mb-4" fill justify>
        {/* Common Pool */}
        <Tab
          eventKey="commonpool"
          title={
            <>
              <FaUsers className="me-2" /> Common Pool
            </>
          }
        >
          <UserCardTable
            tableType="commonpool"
            users={users.filter((u) => !u.roleId)}
            handleEdit={(u) => setSelectedCommonUser(u)}
            handleRelease={handleRelease}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        {/* Assigned Employees */}
        <Tab
          eventKey="assigned"
          title={
            <>
              <FaUserCheck className="me-2" /> Assigned Employees (Main Posting)
            </>
          }
        >
          <UserCardTable
            tableType="assigned"
            users={assignedUsers}
            handleEditProject={(u) => setSelectedAssignedUser(u)}
            handleRelease={handleRelease}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        {/* Additional Posting */}
        <Tab
          eventKey="additional"
          title={
            <>
              <FaBuilding className="me-2" /> Assigned Employees (Additional Posting)
            </>
          }
        >
          <Tabs
            activeKey={additionalSubTab}
            onSelect={setAdditionalSubTab}
            className="sub-tabs mb-4"
            justify
          >
            <Tab
              eventKey="mainposting"
              title={
                <>
                  <FaUserCheck className="me-2" /> Main Posting{" "}
                  <span className="badge bg-primary ms-1">Main</span>
                </>
              }
            >
              <UserCardTable
                tableType="additional"
                users={mainUsersFinal}
                handleEdit={(u) => setSelectedAdditionalUser(u)}
                handleRelease={handleRelease}
                getProjectName={getProjectName}
                getOfficeName={getOfficeName}
              />
            </Tab>

            <Tab
              eventKey="additionalposting"
              title={
                <>
                  <FaBuilding className="me-2" /> Additional Posting{" "}
                  <span className="badge bg-success ms-1">Additional</span>
                </>
              }
            >
              <UserCardTable
                tableType="additional"
                users={addUsersFinal}
                handleEdit={(u) => setSelectedAdditionalUser(u)}
                handleRelease={handleRelease}
                getProjectName={getProjectName}
                getOfficeName={getOfficeName}
              />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>

      {/* ---------- Modals ---------- */}
      {selectedCommonUser && (
        <CommonPoolModal
          user={selectedCommonUser}
          show={true}
          onClose={() => setSelectedCommonUser(null)}
          onComplete={async () => {
            await loadData();
            setSelectedCommonUser(null);
            setAlertMsg("✅ Common pool updated successfully!");
            setAlertVariant("success");
          }}
        />
      )}

      {selectedAssignedUser && (
        <AssignedModal
          user={selectedAssignedUser}
          show={true}
          onClose={() => setSelectedAssignedUser(null)}
          onComplete={async () => {
            await loadData();
            setSelectedAssignedUser(null);
            setAlertMsg("✅ Assigned employee updated successfully!");
            setAlertVariant("success");
          }}
          projects={projects}
          offices={offices}
        />
      )}

      {selectedAdditionalUser && (
        <AdditionalModal
          user={selectedAdditionalUser}
          show={true}
          onClose={() => setSelectedAdditionalUser(null)}
          onComplete={async () => {
            await loadData();
            setSelectedAdditionalUser(null);
            setAlertMsg("✅ Additional posting updated successfully!");
            setAlertVariant("success");
          }}
          offices={offices}
          projects={projects}
        />
      )}

      {showRelease && (
        <ReleaseModal
          user={userToRelease}
          show={true}
          onClose={() => setShowRelease(false)}
          onComplete={async () => {
            await loadData();
            setShowRelease(false);
            setUserToRelease(null);
            setAlertMsg("✅ Employee released successfully!");
            setAlertVariant("success");
          }}
          projects={projects}
        />
      )}
    </div>
  );
};

export default UsersPage;
