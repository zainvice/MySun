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
import { useTranslation } from "react-i18next";
import { useWorkers } from "../../context/workersContext";
function Workers() {
  const {t} = useTranslation()
  
  const { isOpen, onOpen, onClose } = useModal();
  const [isloading, setloading] = useState(true);
  const { workers } = useWorkers()
  useEffect(() => {
    if (!isOpen) {
      if(workers){
        setloading(false)
      }
    }
  }, [isOpen, workers]);

  return (
    <>
      <Layout activePageName={t('workers.pageName')}>
        <Container>
          <div className="flex justify-between mb-2">
            <Heading title={t('workers.heading')} />
            {/*  Add an onClick event to open the modal */}
            <Button title={t('workers.addNewWorkerButton')} onClick={onOpen} />
          </div>
          {isloading ? <Spinner /> : (
            <>
            {workers.length>0?(
              <>
              <WorkersTable workers={workers.filter(worker=>worker.role.toLowerCase()!=="admin")} />
                </>
            ): (
              <>
              <p className="text-center">No workers found!</p>
              </>
            )
            }
            </>
          )
          }
        </Container>
      </Layout>

      <Modal isOpen={isOpen} onClose={onClose}>
        <NewWorkerOverlay onClose={onClose} />
      </Modal>
    </>
  );
}

export default Workers;
