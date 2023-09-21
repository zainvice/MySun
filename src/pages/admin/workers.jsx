import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import Button from "../../common/button";
import Modal from "../../common/modal";
import NewWorkerOverlay from "../../components/newWorkerOverlay";
import WorkersTable from "../../components/workersTable";
import { getWorkers } from "../../api";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (!isModalOpen) getWorkers().then((data) => setWorkers(data));
  }, [isModalOpen]);

  return (
    <>
      <Layout activePageName={"Field Workers"}>
        <Container>
          <div className="flex justify-between mb-2">
            <Heading title={"Workers"} />
            {/*  Add an onClick event to open the modal */}
            <Button title={"Add New Worker"} onClick={toggleModal} />
          </div>
          <WorkersTable workers={workers} />
        </Container>
      </Layout>
      {/* Conditionally render the NewWorker component inside the Modal */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <NewWorkerOverlay onClose={toggleModal} />
      </Modal>
    </>
  );
}

export default Workers;
