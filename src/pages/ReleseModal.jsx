import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {doRealeseEmp} from "../services/userService";

const ReleseModal = ({ user, flag, setShowRelModal }) => {
  const [show, setShow] = useState(flag);
  const [selectedProject, setSelectedProject] = useState("");
  const handleClose = () => {
    setShow(false);
    setShowRelModal(false)
  };

  const doRelease = async () => {
    
      const ru = await doRealeseEmp(user.hrmsCode);
      alert(ru.data?.data);

  };
  //   const handleShow = () => setShow(true);

  console.log("Relese Modal Calling.............")
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Releasing Employee HRMS-  {user.hrmsCode}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Releasing <b>{user.fullName}</b> from the Modules:

          <select
            multiple
            value={selectedProject}
            onChange={(e) => {
              const selectedValues = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedProject(selectedValues);
            }}
            className="form-select mt-3"
          >
            {(user.projectNames || []).map((pname, index) => (
              <option key={index} value={pname}>
                {pname}
              </option>
            ))}
          </select>


        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={doRelease}>
            Release
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default ReleseModal;