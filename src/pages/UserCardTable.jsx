import React, { useState, useMemo } from "react";
import { Card, Table, Button, InputGroup, FormControl, Pagination } from "react-bootstrap";
import {
  FaSearch,
  FaUserEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaIdCard,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaProjectDiagram,
  FaUserCheck,
} from "react-icons/fa";

const UserCardTable = ({
  title,
  users,
  handleEdit,
  tableType,
  searchTerm,
  setSearchTerm,
  getProjectName,
  getOfficeName
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const sortedUsers = useMemo(() => {
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
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));

  const renderSortIcon = (key) =>
    sortConfig.key !== key ? (
      <FaSort className="text-light ms-1" />
    ) : sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );

  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <Card className="p-3 shadow-sm mb-3">
      <h5 className="fw-bold mb-3 text-primary">{title}</h5>

      {/* 🔍 Search Bar */}
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-primary text-white">
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Search by HRMS, Name, Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* 🧾 Table */}
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Table bordered hover responsive className="table-striped align-middle">
          <thead
            style={{
              background: "linear-gradient(90deg, #004b8d, #007bff)",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {tableType === "commonpool" ? (
              <tr>
                <th onClick={() => handleSort("hrmsCode")} style={{ cursor: "pointer" }}>
                  <FaIdCard className="me-1" /> HRMS Code {renderSortIcon("hrmsCode")}
                </th>
                <th onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }}>
                  <FaUser className="me-1" /> Full Name {renderSortIcon("fullName")}
                </th>
                <th>
                  <FaEnvelope className="me-1" /> Email
                </th>
                <th>
                  <FaPhone className="me-1" /> Phone
                </th>
                <th className="text-center">
                  <FaUserEdit className="me-1" /> Action
                </th>
              </tr>
            ) : tableType === "assigned" ? (
              <tr>
                <th>
                  <FaIdCard className="me-1" /> HRMS Code
                </th>
                <th>
                  <FaUser className="me-1" /> Full Name
                </th>
                <th>
                  <FaBuilding className="me-1" /> Main Office
                </th>
                <th>
                  <FaProjectDiagram className="me-1" /> Projects
                </th>
                <th>
                  <FaUserCheck className="me-1" /> Assigned By
                </th>
                <th className="text-center">
                  <FaUserEdit className="me-1" /> Action
                </th>
              </tr>
            ) : (
              <tr>
                <th>
                  <FaIdCard className="me-1" /> HRMS Code
                </th>
                <th>
                  <FaUser className="me-1" /> Full Name
                </th>
                <th>
                  <FaBuilding className="me-1" /> Additional Postings
                </th>
                <th>
                  <FaProjectDiagram className="me-1" /> Projects
                </th>
                <th className="text-center">
                  <FaUserEdit className="me-1" /> Action
                </th>
              </tr>
            )}
          </thead>

          <tbody>
            {currentUsers.length ? (
              currentUsers.map((u) => (
                <tr key={u.hrmsCode}>
                  {tableType === "commonpool" ? (
                    <>
                      <td className="fw-bold text-primary">{u.hrmsCode}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNo || "-"}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-light"
                          className="border-0 bg-primary text-white"
                          title="Edit User"
                          onClick={() => handleEdit(u)}
                        >
                          <FaUserEdit />
                        </Button>
                      </td>
                    </>
                  ) : tableType === "assigned" ? (
                    <>
                      <td className="fw-bold text-primary">{u.hrmsCode}</td>
                      <td>{u.fullName}</td>
                      <td>
                        {u.officeId ? (
                          <span className="badge bg-secondary">{getOfficeName(u.officeId)}</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {(u.projectIds || []).map((p) => (
                          <span key={p.projectId} className="badge bg-success me-1">
                            {getProjectName(p.projectId)}
                          </span>
                        ))}
                      </td>
                      <td>{u.assignedBy || "—"}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-light"
                          className="border-0 bg-primary text-white"
                          title="Edit Projects & Postings"
                          onClick={() => handleEdit(u)}
                        >
                          <FaUserEdit />
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="fw-bold text-primary">{u.hrmsCode}</td>
                      <td>{u.fullName}</td>
                      <td>
                        {(u.officeCds || [])
                          .filter((oid) => oid.officeCd !== u.officeId)
                          .map((oid) => (
                            <span key={oid.officeCd} className="badge bg-secondary me-1">
                              {getOfficeName(oid.officeCd)}
                            </span>
                          ))}
                      </td>
                      <td>
                        {(u.projectIds || []).map((pid) => (
                          <span key={pid.projectId} className="badge bg-success me-1">
                            {getProjectName(pid.projectId)}
                          </span>
                        ))}
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-light"
                          className="border-0 bg-primary text-white"
                          title="Edit Additional Postings"
                          onClick={() => handleEdit(u)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
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
  );
};

export default UserCardTable;
