import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaSearch,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaFileSignature,
} from "react-icons/fa";
import { fetchProjects } from "../services/dashboardService";
import { getToken, getUser } from "../services/authService"; // ✅ from authService
import "../css/Home.css";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (!data || data.length === 0) setMessage("No project details found");
        else {
          setProjects(data);
          setFiltered(data);
        }
      } catch {
        setMessage("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = projects.filter(
      (p) =>
        p.projectName?.toLowerCase().includes(term) ||
        p.projectDesc?.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, projects]);

  return (
    <Container fluid className="home-container">
      {/* Search */}
      <Row className="justify-content-center mb-4">
        <Col xs={10} sm={8} md={6} lg={4}>
          <InputGroup className="search-bar shadow-3d rounded-pill overflow-hidden">
            <InputGroup.Text className="bg-white border-0">
              <FaSearch className="text-primary" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent"
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Loader / Alerts / Project Cards */}
      {loading ? (
        <div className="text-center my-5 fade-in">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="text-muted mt-3 fw-semibold">Loading project details...</p>
        </div>
      ) : message ? (
        <Alert variant="info" className="text-center shadow-3d py-4 fs-6 fade-in">
          <FaInfoCircle className="me-2 text-primary" />
          {message}
        </Alert>
      ) : filtered.length === 0 ? (
        <Alert variant="secondary" className="text-center shadow-3d py-4 fs-6 fade-in">
          <FaInfoCircle className="me-2 text-muted" />
          No matching projects found.
        </Alert>
      ) : (
        <Row className="g-4">
          {filtered.map((proj) => (
            <Col key={proj.projectId} xs={12} sm={6} md={4}>
              <div
                className="h-100 bg-white border rounded-4 p-4 shadow-sm"
                role="button"
              >
                {/* Header */}
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "42px", height: "42px" }}
                    >
                      <FaFileSignature />
                    </div>

                    <div>
                      <div className="fw-semibold text-dark text-truncate">
                        {proj.projectName}
                      </div>
                      <div className="text-muted small">
                        Project ID: {proj.projectId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="text-muted small mb-4">
                  {proj.projectDesc || "Government service portal"}
                </div>

                {/* Footer */}
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="badge bg-primary-subtle text-primary px-3 py-2">
                    Active
                  </span>

                  {/* ✅ Open button with encoded URL parameters */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const token = getToken();
                      const userDet = getUser();

                      // Serialize and encode full userDet
                      const encodedUser = encodeURIComponent(JSON.stringify(userDet));

                      const query = new URLSearchParams({
                        token: token || "",
                        userDet: encodedUser,
                      }).toString();

                      const fullUrl = `${proj.projectUrl}?${query}`;
                      window.open(fullUrl, "_blank");
                    }}
                    className="rounded-pill px-3"
                  >
                    Open <FaExternalLinkAlt className="ms-1" />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
