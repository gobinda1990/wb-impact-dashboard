

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Alert,
  Pagination,
  Card,
  Dropdown
} from "react-bootstrap";
import {
  fetchUsers,
  fetchAssignedUsers,
  fetchCharges,
  fetchCircles,
  fetchPostings,
  fetchProjects,
  fetchRoles,
  assignRolesAndProjects,
  profile_img_url,
  keyicon
} from "../services/userService";
import {
  FaSearch,
  FaUserEdit,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaUserCheck,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaProjectDiagram,
  FaUserCog,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaUserMinus
} from "react-icons/fa";
import { FiSave, FiXCircle } from "react-icons/fi";
import "./UsersPage.css";

import ReleseModal from "./ReleseModal";

/* ------------------------- UserCardTable ------------------------- */
const UserCardTable = ({
  title,
  users,
  handleEdit,
  handleEditProject,
  handleEditRelease,
  tableType,
  searchTerm,
  setSearchTerm,
  getProjectName,
  getOfficeName
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const sortedUsers = React.useMemo(() => {
    const sortable = [...users];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = (a[sortConfig.key] || "").toString().toLowerCase();
        const bVal = (b[sortConfig.key] || "").toString().toLowerCase();
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }
    return sortable;
  }, [users, sortConfig]);

  const handleSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));

  const renderSortIcon = (key) =>
    sortConfig.key !== key ? (
      <FaSort className="text-muted" />
    ) : sortConfig.direction === "asc" ? (
      <FaSortUp />
    ) : (
      <FaSortDown />
    );

  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const [showRelModal, setShowRelModal] = useState(false)
  const [userData, setUserData] = useState([])

  const handleRelese = (u) => {
    setShowRelModal(true);
    setUserData(u);
  }
  return (
    <>
      {showRelModal && (
        <ReleseModal user={userData} flag={true} setShowRelModal={setShowRelModal} />
      )}
      <Card className="p-3 shadow-sm mb-3">
        <h5 className="fw-bold mb-3">{title}</h5>
        <InputGroup className="mb-3">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl
            placeholder="Search by HRMS, Name, Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Table bordered hover responsive className="table-striped align-middle">
            <thead
              className="text-white"
              style={{
                background: "linear-gradient(90deg,#0e70c5,#007bff)",
                position: "sticky",
                top: 0,
                zIndex: 10,
                textAlign: "center",
              }}
            >
              {tableType === "commonpool" ? (
                <tr>
                  <th onClick={() => handleSort("hrmsCode")}>
                    HRMS Code {renderSortIcon("hrmsCode")}
                  </th>
                  <th onClick={() => handleSort("fullName")}>
                    Full Name {renderSortIcon("fullName")}
                  </th>
                  {/* <th>Email</th>*/}

                  <th>Designation</th>
                  <th>Mobile No</th>
                  <th>Last Posting</th>
                  <th>B.O. User ID</th>
                  <th>Assign</th>
                </tr>
              ) : tableType === "assigned" ? (
                <tr>
                  {/* <th onClick={() => handleSort("hrmsCode")}>HRMS Code {renderSortIcon("hrmsCode")} </th> */}
                  <th>HRMS Code</th>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Main Posting</th>
                  <th>Modules</th>
                  <th>Assigned By</th>
                  <th>B.O. User ID</th>
                  <th>Assign</th>
                  <th>Release</th>
                </tr>
              ) : (
                <tr>
                  <th>HRMS Code</th>
                  <th>Full Name</th>
                  <th>Additional Postings</th>
                  <th>Modules</th>
                  <th>Assign</th>
                </tr>
              )}
            </thead>

            <tbody style={{ textAlign: "center" }}>
              {currentUsers.length ? (
                currentUsers.map((u) => (
                  <tr key={u.hrmsCode}>
                    {tableType === "commonpool" ? (
                      <>

                        <td className="fw-bold text-primary">{u.hrmsCode}</td>
                        <td><img src='/images/defaultavatar.png' style={{
                          width: '40px', height: '40px', borderRadius: '50%', display: "flex",
                          alignItems: "center", gap: "10px", whiteSpace: "nowrap",
                          overflow: "hidden"
                        }} />{u.fullName}</td>
                        <td>{u.desigCd}</td>
                        {/* 11-12-2025 */}
                        <td>{u.phoneNo || "-"}</td>
                        {/* <td>{u.panNo || "-"}</td> */}
                        <td>New User</td>
                        <td>{u.boId}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(u)}
                            title="Edit User"
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                      </>
                    ) : tableType === "assigned" ? (
                      <>
                        <td className="fw-bold text-primary">{u.hrmsCode}&nbsp;&nbsp;&nbsp;<img alt="reset password"
                          src={`${keyicon}`}
                          //alt="Profile"
                          style={{ width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', marginLeft: '5px' }}
                        /></td>
                        <td style={{ width: "250px" }}><img
                          src={`${profile_img_url}/${u.imageurl}`}
                          onError={(e) => { e.target.src = "/images/defaultavatar.png"; }}
                          //alt="Profile"
                          style={{
                            width: '40px', height: '40px', borderRadius: '50%', display: "flex",
                            alignItems: "center", gap: "10px", whiteSpace: "nowrap",
                            overflow: "hidden"
                          }}
                        /> &nbsp;&nbsp;&nbsp;{u.fullName}</td>
                        <td>{u.designation}</td>
                        <td>{u.role_name}</td>
                        <td>

                          {/* {(u.main_posting || "")[0] ? (
                          <span className="badge bg-secondary">
                            {getOfficeName(u.main_posting[0])}
                          </span>
                        ) : (
                          "-"
                        )} */}
                          {u.main_posting}
                        </td>
                        <td>
                          {(u.projectNames || []).map((pid) => (
                            // <span key={pid} className="badge bg-success me-1">
                            <span key={pid} className="badge bg-success-subtle  me-1" style={{ color: "black" }}>
                              {getProjectName(pid)}
                            </span>
                          ))}
                        </td>
                        <td>{u.assignedBy || "—"}</td>
                        <td>{u.bo_id}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEditProject(u)}
                            title="Edit Projects"
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleRelese(u)}
                            title="Release">
                            <FaUserMinus />
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="fw-bold text-primary">{u.hrmsCode}</td>
                        <td>{u.fullName}</td>
                        <td>
                          {(u.officeCds || []).slice(1).length
                            ? (u.officeCds || [])
                              .slice(1)
                              .map((oid) => (
                                <span key={oid} className="badge bg-secondary me-1">
                                  {getOfficeName(oid)}
                                </span>
                              ))
                            : "-"}
                        </td>
                        <td>
                          {(u.projectNames || []).map((pid) => (
                            <span key={pid} className="badge bg-success me-1">
                              {getProjectName(pid)}
                            </span>
                          ))}
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(u)}
                            title="Edit Additional Postings"
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-2">
            <Pagination>
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </Card>
    </>
  );
};

/* ---------------------- UserModal ---------------------- */
//const [selectedPostingType, setSelectedPostingType] = useState("");
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
  selectedPostingType,
  setSelectedPostingType,
  changePostingType,
  changeRole,
  handleSave
}) => {
  // ✅ New logic: assigned & additionalPostings can only edit projects + offices
  const disableField = (type) => {
    if (tab === "commonpool") {
      if (type === "role" || type === "officeType") return false;
      // return false;
    }
    // if (["assigned", "additionalPostings"].includes(tab)) {
    //   return !["projects", "offices"].includes(type);
    // }
    // return true;
    // TAB RULES
    if (tab === "assigned") {
      // return !["projects", "office"].includes(type);

      // return type !== "selectedProjects";
      if (type === "role" || type === "officeType" || type === "circle" || type === "charge" || type === "office") return true;
      return false;
      //  return type === "selectedRoles";
    }
    // if (tab === "additionalPostings") {
    //   return type !== "office";
    // }

    // POSTING TYPE RULES (commonpool)
    //const value = postingType || selectedPostingType;
    if (selectedPostingType === "CI") return type !== "circle";
    if (selectedPostingType === "CH") return type !== "charge";
    if (selectedPostingType === "OF") return type !== "office";

    return ["circle", "charge", "office"].includes(type);
    //return true;
  };



  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
      <Modal.Header closeButton style={{ background: "linear-gradient(90deg,#002147,#004b8d)", color: "white" }}>
        <Modal.Title>
          {tab === "commonpool" ? (
            <>
              <FaUserEdit className="me-2" /> Edit User – {selectedUser.fullName}
            </>
          ) : (
            <>
              <FaUserTie className="me-2" /> Edit Projects – {selectedUser.fullName}
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        <Form>
          {/* Basic Info */}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label><FaIdCard className="me-1 text-primary" /> HRMS Code</Form.Label>
              <Form.Control type="text" value={selectedUser.hrmsCode} readOnly disabled className="bg-light" />
            </div>
            <div className="col-md-4">
              <Form.Label><FaEnvelope className="me-1 text-primary" /> Email</Form.Label>
              <Form.Control type="text" value={selectedUser.email} readOnly disabled className="bg-light" />
            </div>
            <div className="col-md-4">
              <Form.Label><FaPhone className="me-1 text-primary" /> Phone</Form.Label>
              <Form.Control type="text" value={selectedUser.phoneNo || "-"} readOnly disabled className="bg-light" />
            </div>
          </div>
          {/* ----------- Priyanka Pal---------- */}

          {/* Office & Role */}
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Label><FaUserCog className="me-1 text-primary" /> Role</Form.Label>
              <Form.Select
                value={
                  selectedRoles[0] ||
                  (Array.isArray(selectedUser.roleId)
                    ? selectedUser.roleId[0]
                    : selectedUser.roleId) ||
                  ""
                }
                // onChange={(e) => setSelectedRoles([e.target.value])}
                // setSelectedRoles([e.target.value])
                onChange={(e) => changeRole(e.target.value)}
                disabled={disableField("role")}
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>{r.roleName}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label><FaBuilding className="me-1 text-primary" /> Office Type</Form.Label>
              <Form.Select
                value={selectedPostingType}
                // || selectedUser.officeCds?.[0] || ""}
                onChange={(e) => changePostingType(e.target.value)}
                //onChange={changePostingType}
                disabled={disableField("officeType")}
              >
                <option value="">Select Office Type</option>
                <option key={"CH"} value={"CH"}>Charge</option>
                <option key={"CI"} value={"CI"}>Circle</option>
                <option key={"OF"} value={"OF"}>Office</option>

              </Form.Select>
            </div>


          </div>
          {/* Circle & Charge & office */}
          
          <div className="row mb-3">
             <div className="col-md-6">
              <Form.Label><FaBuilding className="me-1 text-primary" /> Circle</Form.Label>
              <Form.Select
                id="circle_id"
                value={selectedCircle || selectedUser.circleCd || ""}
                onChange={(e) => setSelectedCircle(e.target.value)}
                disabled={disableField("circle")}
              >
                <option value="">Select Circle</option>
                {circles.map((c) => (
                  <option key={c.circleCd} value={c.circleCd}>{c.circleNm}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label><FaUserTie className="me-1 text-primary" /> Charge</Form.Label>
              <Form.Select
                id="charge_id"
                value={selectedCharge || selectedUser.chargeCd || ""}
                onChange={(e) => setSelectedCharge(e.target.value)}
                disabled={disableField("charge")}
              >
                <option value="">Select Charge</option>
                {charges.map((c) => (
                  <option key={c.chargeCd} value={c.chargeCd}>{c.chargeNm}</option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label><FaBuilding className="me-1 text-primary" /> Office</Form.Label>
              <Form.Select
                id="office_id"
                value={selectedOffices[0] || selectedUser.officeCds?.[0] || ""}
                onChange={(e) => setSelectedOffices([e.target.value])}
                disabled={disableField("office")}
              >
                <option value="">Select Office</option>
                {offices.map((o) => (
                  <option key={o.officeCd} value={o.officeCd}>{o.officeNm}</option>
                ))}
              </Form.Select>
            </div>
           
            
          </div>


          {/* Projects */}
          <Form.Label><FaProjectDiagram className="me-1 text-success" /> Modules</Form.Label>
          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start"
            // disabled={disableField("projects")} //edit on 04-02-2025 Priyanka Pal
            >
              {selectedProjects.length
                ? selectedProjects.map((pid) => getProjectName(pid)).join(", ")
                : "Select Projects"}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto", width: "100%" }}>
              <div className="px-2 py-2">
                <FormControl placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="mb-2" />
                {filteredProjects.map((p) => (
                  <Form.Check key={p.projectId} type="checkbox" label={p.projectName} required checked={selectedProjects.includes(p.projectId)} onChange={() => toggleProject(p.projectId)}
                  // disabled={disableField("projects")} 
                  />
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Additional Postings */}
          {/* <Form.Label><FaBuilding className="me-1 text-success" /> Additional Postings</Form.Label>
          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start" disabled={disableField("offices")}>
              {selectedOffices.length > 1
                ? selectedOffices.slice(1).map((oid) => getOfficeName(oid)).join(", ")
                : "Select Additional Offices"}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto", width: "100%" }}>
              <div className="px-2 py-2">
                <FormControl placeholder="Search offices..." value={officeSearch} onChange={(e) => setOfficeSearch(e.target.value)} className="mb-2" />
                {filteredOffices.map((o) => (
                  <Form.Check key={o.officeCd} type="checkbox" label={o.officeNm} checked={selectedOffices.includes(o.officeCd)} onChange={() => toggleOffice(o.officeCd)} disabled={disableField("offices")} />
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown> */}
          {/* ----------- Priyanka Pal---------- */}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          <FiXCircle className="me-1" /> Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <FiSave className="me-1" /> Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

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
  const [selectedOffices, setSelectedOffices] = useState("");

  const [selectedPostingType, setSelectedPostingType] = useState("");//edit on 04-12-2025 Priyanka Pal

  const [message, setMessage] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [officeSearch, setOfficeSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, c, ci, o, p, r] = await Promise.all([
          fetchUsers(),
          fetchCharges(),
          fetchCircles(),
          fetchPostings(),
          fetchProjects(),
          fetchRoles()
        ]);
        setUsers(u || []);
        setFilteredUsers(u || []);
        setCharges(c || []);
        setCircles(ci || []);
        setOffices(o || []);
        setProjects(p || []);
        setRoles(Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : []);
        const au = await fetchAssignedUsers();
        setAssignedUsers(au || []);
        console.log(au);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load data. Please try again.");
      }
    };
    loadData();
  }, []);

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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setSelectedCharge(user.chargeCd || "");
    setSelectedCircle(user.circleCd || "");
    setSelectedRoles(
      user.roleId ? (Array.isArray(user.roleId) ? user.roleId : [user.roleId]) : []
    );
    setSelectedProjects(user.projectName || []);
    setSelectedOffices(user.main_posting || "");

    setSelectedPostingType(""); //edit on 04-12-2025 Priyanka Pal
    setProjectSearch("");
    setOfficeSearch("");
    setShowModal(true);
  };

  const handleEditProject = (user) => {
    // alert("user="+user);
    // alert("user.selectedPostingType"+user.selectedPostingType);
    setSelectedUser(user);
    setSelectedCharge(user.chargeCd || "");
    setSelectedCircle(user.circleCd || "");
    setSelectedRoles(
      // user.roleId ? (Array.isArray(user.roleId) ? user.roleId : [user.roleId]) : []
      user.roleId || ""
    );
    setSelectedProjects(user.projectNames || []);
    //alert("user.projectName"+user.projectNames);
    //setSelectedOffices(user.main_posting || "");
    setSelectedOffices(user.officeCds || "")

    setSelectedPostingType(user.office_type); //edit on 04-12-2025 Priyanka Pal ****
    setProjectSearch("");
    setOfficeSearch("");
    setShowModal(true);
  };

  const handleEditRelease = (user) => {

    console.log("Release user=" + user.hrmsCode);



  };
  // -------------Priyanka PAl-------
  const changeRole = (value) => {
    //alert("value=" + value );
    if (value === "R2") {
      setSelectedPostingType("CI");


    }
    else if (value === "R3") {
      setSelectedPostingType("CH")

    }
    else if (value === "R4") {
      setSelectedPostingType("OF")

    } else {
      setSelectedPostingType("");

    }
    setSelectedRoles([value]);

  }
  const changePostingType = (value) => {
    // alert("selectedRoles=" + selectedRoles);
    // alert("selectedPostingType=" + selectedPostingType);
    if (selectedRoles.length === 0) {
      alert("Please select at least one role.");
      return;
    }
    // else if(selectedRoles==="R2"){
    //   setSelectedPostingType(CH);
    //   selectedPostingType="CH";
    // }

    setSelectedPostingType(value);
    // auto reset fields
    if (value === "CI") {
      setSelectedCharge("");
      setSelectedOffices([""]);
      // document.getElementById("circle_id").disabled = false;
      // setFieldStatus({ circle: false, charge: true, office: true }); // only circle enabled
    }
    if (value === "CH") {
      setSelectedCircle("");
      setSelectedOffices([""]);
      // document.getElementById("charge_id").disabled = false;
      //    setFieldStatus({ circle: true, charge: false, office: true }); // only charge enabled
    }
    if (value === "OF") {
      setSelectedCircle("");
      setSelectedCharge("");
      // document.getElementById("office_id").disabled = false;
      //   setFieldStatus({ circle: true, charge: true, office: false }); // only office enabled
    }
    //   else {
    //   setFieldStatus({ circle: true, charge: true, office: true }); // all enabled by default
    // }

  };

  const handleSave = async () => {
    try {
      //  alert("Saving user changes...");
      if (selectedRoles.length === 0) {
        alert("Please select at least one role.");
        return;
      }
      if (selectedProjects.length === 0) {
        alert("Please select at least one Project.");
        return;
      }
      if (selectedCharge.length === 0 && selectedCircle.length === 0 && selectedOffices.length === 0) {
        alert("Please select at least one Posting.");
        return;
      }



      const data = {
        hrmsCode: selectedUser.hrmsCode,
        chargeCd: selectedCharge,
        circleCd: selectedCircle,
        roleId: selectedRoles,
        projectIds: selectedProjects,
        officeCds: selectedOffices
      };
      await assignRolesAndProjects(data);
      setMessage("✅ User Assigned successfully!");
      setShowModal(false);

      const [refreshedUsers, refreshedAssigned] = await Promise.all([
        fetchUsers(),
        fetchAssignedUsers()
      ]);
      setUsers(refreshedUsers || []);
      setAssignedUsers(refreshedAssigned || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update user.");
      setShowModal(false);
    }
  };
  // for Search in assignTab--11-12-2025
  const getFilteredAssigned = () => {
    const term = searchTerm.toLowerCase();
    return assignedUsers.filter(
      (u) =>
        (u.fullName || "").toLowerCase().includes(term) ||
        (u.hrmsCode || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term)
    );
  };
  // for Search in addtional tab--11-12-2025
  const getFilteredAdditional = () => {
    const term = searchTerm.toLowerCase();
    return assignedUsers.filter(
      (u) =>
        (u.fullName || "").toLowerCase().includes(term) ||
        (u.hrmsCode || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term)
    );
  };


  // -------------Priyanka PAl-------

  const toggleProject = (id) =>
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const toggleOffice = (id) =>
    setSelectedOffices((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );

  const filteredProjects = projects.filter((p) =>
    (p.projectName || "").toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredOffices = offices.filter((o) =>
    (o.officeNm || "").toLowerCase().includes(officeSearch.toLowerCase())
  );

  const getProjectName = (id) =>
    projects.find((p) => p.projectId === id)?.projectName || id;

  const getOfficeName = (id) =>
    offices.find((o) => o.officeCd === id)?.officeNm || id;

  return (
    <div className="container-fluid mt-4">
      <h3 className="text-primary fw-bold mb-3">
        <div id="user-prof-detail" >

        </div>
        <FaUserTie className="me-2" /> Employee Management
      </h3>
      {message && <Alert variant="info">{message}</Alert>}

      <Tabs activeKey={tab} onSelect={setTab} className="mb-4" fill>
        <Tab
          eventKey="commonpool"
          title={
            <span>
              <FaUsers className="me-2" /> Common Pool
            </span>
          }
        >
          <UserCardTable
            title="Common Pool Employees"
            users={filteredUsers.filter((u) => !u.roleId)}
            handleEdit={handleEdit}
            tableType="commonpool"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        <Tab
          eventKey="assigned"
          title={
            <span>
              <FaUserCheck className="me-2" /> Assigned Employees(Main Posting)
            </span>
          }
        >
          <UserCardTable
            title="Assigned Main Posting"
            // users={assignedUsers}
            users={getFilteredAssigned()}
            handleEdit={handleEdit}
            handleEditProject={handleEditProject}
            handleEditRelease={handleEditRelease}
            tableType="assigned"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        </Tab>

        <Tab
          eventKey="additionalPostings"
          title={
            <span>
              <FaBuilding className="me-2" /> Assigned Employees(Additional Postings)
            </span>
          }
        >
          <UserCardTable
            title="Assign Additional Postings"
            // users={assignedUsers}
            users={getFilteredAdditional()}
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

          selectedPostingType={selectedPostingType}//edited on 04-12-25 Priyanka Pal
          setSelectedPostingType={setSelectedPostingType}//edited on 04-12-25 Priyanka Pal

          changePostingType={changePostingType}
          changeRole={changeRole}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default UsersPage;
// ---off by Priyanka Pal-----04-12-2025------------
