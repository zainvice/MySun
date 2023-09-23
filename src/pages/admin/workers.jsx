import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import Button from "../../common/button";
import Modal from "../../common/modal";
import NewWorkerOverlay from "../../components/newWorkerOverlay";
import WorkersTable from "../../components/workersTable";
import { getWorkers } from "../../api";
import { useModal } from "../../hooks";
import Spinner from "../../common/spinner";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const { isOpen, onOpen, onClose } = useModal();
  const [isloading, setloading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setloading(true);
      getWorkers().then((data) => {
        setWorkers(data);
        setloading(false);
      });
    }
  }, [isOpen]);

  return (
    <>
      <Layout activePageName={"Field Workers"}>
        <Container>
          <div className="flex justify-between mb-2">
            <Heading title={"Workers"} />
            {/*  Add an onClick event to open the modal */}
            <Button title={"Add New Worker"} onClick={onOpen} />
          </div>

          {isloading ? (
            <div className="h-96 w-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <WorkersTable workers={workers} />
          )}
        </Container>
      </Layout>
      {/* Conditionally render the NewWorker component inside the Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <NewWorkerOverlay onClose={onClose} />
      </Modal>
    </>
  );
}

export default Workers;
