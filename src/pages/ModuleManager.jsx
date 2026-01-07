import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  FaCubes,
  FaPlusCircle,
  FaLink,
  FaProjectDiagram,
} from "react-icons/fa";

import { fetchProjects } from "../services/dashboardService";
import { addModule } from "../services/dashboardService";

const ModuleManager = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [moduleName, setModuleName] = useState("");
  const [moduleUrl, setModuleUrl] = useState("");

  /* ===== Fetch Projects ===== */
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
      } catch {
        setMessage("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [message]);

  /* ===== Add Module ===== */
  const handleAddModule = async () => {
    if (!moduleName || !moduleUrl) {
      setMessage("Module Name and Module URL are required");
      return;
    }

    const moduleData = {
      moduleName,
      moduleUrl,
    };

    try {
      await addModule(moduleData);
      setMessage("Module added successfully");

      setModuleName("");
      setModuleUrl("");
      
    } catch {
      setMessage("Failed to add module");
    }
  };

  return (
    <Container fluid className="home-container">
      {/* ===== Page Header ===== */}
      <Row className="mb-4">
        <Col>
          <h3 className="text-primary fw-bold">
            <FaCubes className="me-2" />
            Module Management
          </h3>
        </Col>
      </Row>

      <Row>
        {/* ===== Add Module ===== */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white fw-semibold">
              <FaPlusCircle className="me-2" />
              Add New Module
            </Card.Header>

            <Card.Body>
              {message && <Alert variant="info">{message}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCubes className="me-2 text-primary" />
                    Module Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter module name"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLink className="me-2 text-primary" />
                    Module URL
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="/admin/dashboard"
                    value={moduleUrl}
                    onChange={(e) => setModuleUrl(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleAddModule}>
                  <FaPlusCircle className="me-2" />
                  Add Module
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== Project List ===== */}
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white text-primary fw-semibold border-bottom">
              <FaProjectDiagram className="me-2" />
              Available Modules
            </Card.Header>

            <Card.Body style={{ maxHeight: "360px", overflowY: "auto" }}>
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              {!loading && message && filtered.length === 0 && (
                <Alert variant="warning">{message}</Alert>
              )}

              <ListGroup variant="flush">
                {filtered.map((project) => (
                  <ListGroup.Item key={project.id}>
                    {project.projectName || project.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModuleManager;
