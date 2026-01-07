import React, { useState, useMemo } from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserEdit,
  FaUserMinus,
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaBuilding,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import "../css/UserCardTable.css";
import UserDetailModal from "./UserDetailModal";
import { fetchUserDetails } from "../services/userService";

const UserCardTable = ({
  tableType = "commonpool",
  users = [],
  handleEdit,
  handleEditProject,
  handleRelease,
  getProjectName,
  getOfficeName,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const itemsPerPage = 7;

  const headers = {
    commonpool: [
      { label: "HRMS Code", key: "hrmsCode", sortable: true },
      { label: "Full Name", key: "fullName", sortable: true },
      { label: "Designation", key: "desigCd" },
      { label: "Mobile No", key: "phoneNo" },
      { label: "Last Posting" },
      { label: "B.O. User ID", key: "boId" },
      { label: "Assign" },
    ],
    assigned: [
      { label: "HRMS Code", key: "hrmsCode" },
      { label: "Full Name", key: "fullName" },
      { label: "Designation", key: "designation" },
      { label: "Main Posting", key: "main_posting" },
      { label: "Modules" },
      { label: "Roles" },
      { label: "Assigned By", key: "approverName" },
      { label: "B.O. User ID", key: "bo_id" },
      { label: "Edit / Update" },
      { label: "Release" },
    ],
    additional: [
      { label: "HRMS Code", key: "hrmsCode" },
      { label: "Full Name", key: "fullName" },
      { label: "Additional Postings" },
      { label: "Modules" },
      { label: "Roles" },
      { label: "Assign Additional" },
      { label: "Release" },
    ],
  }[tableType];

  const iconMap = {
    commonpool: <FaUsers />,
    assigned: <FaUserCheck />,
    additional: <FaBuilding />,
  };

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // ---------- Filtering & Sorting ----------
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((u) =>
      Object.values(u).some(
        (val) => val && val.toString().toLowerCase().includes(term)
      )
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const aVal = (a[sortConfig.key] || "").toString().toLowerCase();
      const bVal = (b[sortConfig.key] || "").toString().toLowerCase();
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filteredUsers, sortConfig]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));

  const renderSortIcon = (key) =>
    sortConfig.key !== key ? (
      <FaSort className="text-light" />
    ) : sortConfig.direction === "asc" ? (
      <FaSortUp />
    ) : (
      <FaSortDown />
    );

  const toggleExpand = (key) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ---------- Render ----------
  return (
    <Card className="usercard-3d hover-lift mb-4">
      <Card.Body className="p-4">
        {/* Header */}
        <Row className="align-items-center g-3 mb-3">
          <Col md={6}>
            <h6 className="fw-bold text-primary d-flex align-items-center gap-2">
              {iconMap[tableType]}{" "}
              {{
                commonpool: "Common Pool Employee",
                assigned: "Assigned Employee",
                additional: "Additional Employee",
              }[tableType]}
            </h6>
          </Col>
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Table */}
        <div className="table-responsive">
          <Table
            hover
            bordered
            className="align-middle text-center shadow-sm rounded-3 overflow-hidden"
          >
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={h.sortable ? () => handleSort(h.key) : undefined}
                    style={{
                      cursor: h.sortable ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    {h.label} {h.sortable && renderSortIcon(h.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.length ? (
                currentUsers.map((u) => (
                  <tr key={u.hrmsCode} className="hover-highlight">
                    {/* HRMS Code */}
                    <td>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none fw-semibold text-primary"
                        onClick={async () => {
                          const data = await fetchUserDetails(u.hrmsCode);
                          if (data) setSelectedUser(data);
                        }}
                      >
                        {u.hrmsCode}
                      </Button>
                    </td>

                    {/* Full Name */}
                    <td className="text-start">
                      <div className="d-flex align-items-center">
                        <img
                          src={u.profileImageUrl || "/images/defaultavatar.png"}
                          alt={u.fullName || "User"}
                          width="35"
                          height="35"
                          className="rounded-circle me-2"
                          style={{ objectFit: "cover", border: "1px solid #ddd" }}
                        />
                        <span>{u.fullName || "-"}</span>
                      </div>
                    </td>

                    {/* COMMON POOL */}
                    {tableType === "commonpool" && (
                      <>
                        <td>{u.desigName || "-"}</td>
                        <td>{u.phoneNo || "-"}</td>
                        <td>New User</td>
                        <td>{u.boId || "-"}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(u)}
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                      </>
                    )}

                    {/* ASSIGNED EMPLOYEES */}
                    {tableType === "assigned" && (
                      <>
                        <td>{u.desigName || "-"}</td>

                        {/* MAIN POSTING */}
                        <td className="main-posting-cell">
                          {safeArray(u.postings).length ? (
                            <>
                              <span className="badge bg-info-subtle text-info fw-semibold">
                                {u.postings[0].officeName}
                              </span>
                              {expandedUsers[`posting-${u.hrmsCode}`] &&
                                u.postings.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-info-subtle text-info fw-semibold ms-1"
                                  >
                                    {p.officeName}
                                  </span>
                                ))}
                              {u.postings.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`posting-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`posting-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-info" />
                                  ) : (
                                    <FaChevronDown className="text-info" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* MODULES */}
                        <td className="modules-cell">
                          {safeArray(u.projects).length ? (
                            <>
                              <span className="badge bg-success-subtle text-success fw-semibold">
                                {u.projects[0].projectName}
                              </span>
                              {expandedUsers[`modules-${u.hrmsCode}`] &&
                                u.projects.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-success-subtle text-success fw-semibold ms-1"
                                  >
                                    {p.projectName}
                                  </span>
                                ))}
                              {u.projects.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`modules-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`modules-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-success" />
                                  ) : (
                                    <FaChevronDown className="text-success" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* ROLES */}
                        <td className="role-cell">
                          {safeArray(u.projects).length ? (
                            <>
                              <span className="badge bg-success-subtle text-success fw-semibold">
                                {u.projects[0].roleName}
                              </span>
                              {expandedUsers[`roles-${u.hrmsCode}`] &&
                                u.projects.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-success-subtle text-success fw-semibold ms-1"
                                  >
                                    {p.roleName}
                                  </span>
                                ))}
                              {u.projects.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`roles-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`roles-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-success" />
                                  ) : (
                                    <FaChevronDown className="text-success" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* LAST FOUR COLUMNS */}
                        <td>{u.postings?.[0]?.approverName || "-"}</td>
                        <td>{u.boId || "-"}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEditProject(u)}
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRelease(u)}
                          >
                            <FaUserMinus />
                          </Button>
                        </td>
                      </>
                    )}

                    {/* ADDITIONAL POSTING EMPLOYEES */}
                    {tableType === "additional" && (
                      <>
                        {/* ADDITIONAL POSTING */}
                        <td className="main-posting-cell">
                          {safeArray(u.postings).length ? (
                            <>
                              <span className="badge bg-info-subtle text-info fw-semibold">
                                {u.postings[0].officeName}
                              </span>
                              {expandedUsers[`addpost-${u.hrmsCode}`] &&
                                u.postings.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-light text-secondary ms-1"
                                  >
                                    {p.officeName}
                                  </span>
                                ))}
                              {u.postings.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`addpost-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`addpost-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-info" />
                                  ) : (
                                    <FaChevronDown className="text-info" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* MODULES */}
                        <td className="modules-cell">
                          {safeArray(u.projects).length ? (
                            <>
                              <span className="badge bg-success-subtle text-success fw-semibold">
                                {u.projects[0].projectName}
                              </span>
                              {expandedUsers[`addmodules-${u.hrmsCode}`] &&
                                u.projects.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-success-subtle text-success fw-semibold"
                                  >
                                    {p.projectName}
                                  </span>
                                ))}
                              {u.projects.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`addmodules-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`addmodules-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-success" />
                                  ) : (
                                    <FaChevronDown className="text-success" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* ROLES */}
                        <td className="role-cell">
                          {safeArray(u.projects).length ? (
                            <>
                              <span className="badge bg-success-subtle text-success fw-semibold">
                                {u.projects[0].roleName}
                              </span>
                              {expandedUsers[`addroles-${u.hrmsCode}`] &&
                                u.projects.slice(1).map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-success-subtle text-success fw-semibold ms-1"
                                  >
                                    {p.roleName}
                                  </span>
                                ))}
                              {u.projects.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-1"
                                  onClick={() =>
                                    toggleExpand(`addroles-${u.hrmsCode}`)
                                  }
                                >
                                  {expandedUsers[`addroles-${u.hrmsCode}`] ? (
                                    <FaChevronUp className="text-secondary" />
                                  ) : (
                                    <FaChevronDown className="text-secondary" />
                                  )}
                                </Button>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* LAST TWO COLUMNS */}
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(u)}
                          >
                            <FaUserEdit />
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRelease(u)}
                          >
                            <FaUserMinus />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3 flex-wrap gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                variant={idx + 1 === currentPage ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedUser && (
          <UserDetailModal
            show={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            user={selectedUser}
            getProjectName={getProjectName}
            getOfficeName={getOfficeName}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default React.memo(UserCardTable);
