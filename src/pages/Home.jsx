import React, { useEffect, useState } from "react";
import {Container,Row,Col,Card,Button,Alert,Spinner,Form,InputGroup} from "react-bootstrap";
import {FaProjectDiagram,FaSearch,FaExternalLinkAlt,FaInfoCircle} from "react-icons/fa";
import { fetchProjects } from "../services/dashboardService";
import "./Home.css";

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
        if (!data || data.length === 0) {
          setMessage("No project details found");
        } else {
          setProjects(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setMessage("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Search filter
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
    <Container fluid className="mt-4 px-3 home-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h2 className="text-primary fw-bold mb-2 d-flex align-items-center">
          <FaProjectDiagram className="me-2" />
           Dashboard
        </h2>
      </div>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Loader / Message / Projects */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="text-muted mt-3 fw-semibold">Loading project details...</p>
        </div>
      ) : message ? (
        <Alert
          variant="info"
          className="text-center shadow-sm bg-light border-0 py-4 fs-6"
        >
          <FaInfoCircle className="me-2 text-primary" />
          {message}
        </Alert>
      ) : filtered.length === 0 ? (
        <Alert
          variant="secondary"
          className="text-center shadow-sm border-0 py-4 fs-6"
        >
          <FaInfoCircle className="me-2 text-muted" />
          No matching projects found.
        </Alert>
      ) : (
        <Row className="g-4">
          {filtered.map((proj) => (
            <Col key={proj.projectId} xs={12} sm={6} md={4} lg={3}>
              <Card className="project-card h-100 border-0 shadow-sm">
                <div className="card-accent" />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold text-primary d-flex align-items-center mb-2">
                      <FaProjectDiagram className="me-2" />
                      {proj.projectName}
                    </Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      {proj.projectDesc || "Government service portal"}
                    </Card.Text>
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
                      className="rounded-pill"
                    >
                      Visit <FaExternalLinkAlt className="ms-1" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
