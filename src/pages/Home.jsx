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
  FaProjectDiagram,
  FaSearch,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { fetchProjects } from "../services/dashboardService";
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
        <Row className="g-4 fade-in">
          {filtered.map((proj) => (
            <Col key={proj.projectId} xs={12} sm={6} md={4}>
              <div className="project-card-3d shadow-3d h-100">
                <div className="card-top-bar"></div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-semibold text-dark d-flex align-items-center mb-2 text-truncate">
                      <FaProjectDiagram className="me-2 text-primary" />
                      {proj.projectName}
                    </h6>
                    <p className="text-muted small mb-3 text-truncate">
                      {proj.projectDesc || "Government service portal"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-light text-primary border">
                      ID: {proj.projectId}
                    </span>
                    <Button
                      variant="outline-primary"
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      className="rounded-pill shadow-3d hover-lift"
                    >
                      Visit <FaExternalLinkAlt className="ms-1" />
                    </Button>
                  </div>
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
