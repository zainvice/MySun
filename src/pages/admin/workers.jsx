import React, { useState } from "react";
import Modal from "../../common/modal"; // Import the Modal component
import NewWorker from "./newWorker"; // Import your NewWorker component
import Heading from "../../common/heading";
import Button from "../../common/button";
import WorkersTable from "../../components/workersTable";
import Container from "../../common/container";
import Layout from "../../layout";
function Workers() {
  //  Create a state variable to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Layout>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={"Workers"} />
          {/*  Add an onClick event to open the modal */}
          <Button title={"Add New Worker"} onClick={toggleModal} />
        </div>
        <WorkersTable />

        {/* Conditionally render the NewWorker component inside the Modal */}
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <NewWorker />
        </Modal>
      </Container>
    </Layout>
  );
}

export default Workers;