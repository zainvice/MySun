import React, { useState } from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import Button from "../../common/button";
import Modal from "../../common/modal";
import NewWorkerOverlay from "../../components/newWorkerOverlay";
import WorkersTable from "../../components/workersTable";



function Workers() {
  //  Create a state variable to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Layout>
        <Container>
          <div className="flex justify-between mb-2">
            <Heading title={"Workers"} />
            {/*  Add an onClick event to open the modal */}
            <Button title={"Add New Worker"} onClick={toggleModal} />
          </div>
          <WorkersTable />
        </Container>
      </Layout>
      {/* Conditionally render the NewWorker component inside the Modal */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <NewWorkerOverlay />
      </Modal>
    </>
  );
}

export default Workers;
