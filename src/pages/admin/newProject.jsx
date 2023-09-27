import { useEffect, useState } from "react";
import { useModal } from "../../hooks";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import DateInput from "../../common/dateInput";
import Button from "../../common/button";
import Modal from "../../common/modal";
import { createProject, getWorkers } from "../../api";
import WorkerOverlay from "../../components/workerOverlay";
import * as xlsx from "xlsx";
import Message from "../../common/message";
import jwtDecode from "jwt-decode";
import Spinner from "../../common/spinner";

function NewProject() {
  const { isOpen, onOpen, onClose } = useModal();
  const [inputValues, setInputValues] = useState({});
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [isCorrectStartDate, setCorrectStartDate] = useState(true);
  const [isCorrectEndDate, setCorrectEndDate] = useState(true);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const {
    isOpen: openMessage,
    onOpen: onOpenMessage,
    onClose: onCloseMessage,
  } = useModal();
  const {
    isOpen: openLoading,
    onOpen: onOpenLoading,
    onClose: onCloseLoading,
  } = useModal();

  useEffect(() => {
    getWorkers().then((data) => {
      setWorkers(
        data?.filter((worker) => worker.role.toLowerCase() !== "admin") ?? []
      );
    });
  }, []);

  const onChange = (e) => {
    const target = e.target ?? {};
    setInputValues((prev) => ({
      ...prev,
      [target?.name]: target?.value,
    }));
  };

  const onFileSelect = (e) => {
    const file = e?.target?.files[0];
    setFileName(file?.name);

    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        const fileBinary = e.target.result;
        const readedData = xlsx.read(fileBinary, { type: "binary" });
        const workSheetNames = readedData.SheetNames[0];
        const worksheets = readedData.Sheets[workSheetNames];
        const data = xlsx.utils.sheet_to_json(worksheets, { header: 1 });
        const header = data[0];
        const rows = data.slice(1, data.length - 1);

        const tasks = rows.map((row) => {
          const task = Object.create(null);
          row.map((data, index) => {
            Object.assign(task, { [header[index]]: data });
          });
          return task;
        });

        setInputValues((prev) => ({
          ...prev,
          projectData: { tasks, completionPercentage: 0 },
        }));
      };
    }
  };

  const onSubmit = (e) => {
    e?.preventDefault();
    const currentDate = new Date(Date.now());
    const startDate = new Date(inputValues?.startDate);
    const endDate = new Date(inputValues?.endDate);

    if (startDate <= currentDate) {
      setCorrectStartDate(false);
      return;
    } else if (endDate < startDate) {
      setCorrectEndDate(false);
      return;
    } else {
      setCorrectStartDate(true);
      setCorrectEndDate(true);
    }

    onOpenLoading();
    const userInfo = jwtDecode(sessionStorage.getItem("accessToken"));
    createProject({
      ...inputValues,
      workers: selectedWorkers,
      admin: userInfo.email,
    })
      .then(() => {
        setFileName("");
        setInputValues({});
        setSelectedWorkers([]);
        setMessage("Project created sccessfully!");
        onOpenMessage();
      })
      .catch((error) => {
        const data = error?.response?.data;
        setMessage(data?.error ?? "Something went wrong!");
        onOpenMessage();
      })
      .finally(() => {
        onCloseLoading();
      });
  };

  return (
    <>
      <Layout activePageName={"Creating New Project"}>
        <Container>
          <div className="h-full grid grid-cols-12 gap-2 sm:gap-4 text-[#505050]">
            <div className="col-span-12  md:col-span-8 h-full">
              <Heading
                title={"New Project"}
                additionalClases={"mb-2 lg:mb-8"}
              />
              <form
                className=" flex flex-col gap-2 lg:gap-6 lg:ml-14"
                onSubmit={onSubmit}
              >
                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    Project Name:
                  </span>
                  <input
                    type="text"
                    name="projectName"
                    value={inputValues?.projectName ?? ""}
                    onChange={onChange}
                    placeholder="Enter project name"
                    className="h-10 w-full py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
                  />
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    Start Date:
                  </span>
                  <div className="w-full">
                    <DateInput
                      onChange={onChange}
                      value={inputValues?.startDate ?? ""}
                      placeholder={"Choose start date of project"}
                      additonalProps={{
                        name: "startDate",
                      }}
                    />
                    {!isCorrectStartDate && (
                      <p className="pl-2 text-sm text-red-400">
                        Start date should be greater than today's date
                      </p>
                    )}
                  </div>
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    End Date:
                  </span>
                  <div className="w-full">
                    <DateInput
                      onChange={onChange}
                      value={inputValues?.endDate ?? ""}
                      placeholder={"Choose end date of project"}
                      additonalProps={{
                        name: "endDate",
                      }}
                    />
                    {!isCorrectEndDate && (
                      <p className="pl-2 text-sm text-red-400">
                        End date should be greater than today's date
                      </p>
                    )}
                  </div>
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">Worker:</span>
                  <input
                    readOnly
                    type="text"
                    onClickCapture={() => onOpen()}
                    value={
                      selectedWorkers?.length
                        ? selectedWorkers
                            .map((worker) => worker.fullName)
                            .join(", ")
                        : ""
                    }
                    placeholder="Choose the worker for project"
                    className="h-10 w-full py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2] cursor-pointer"
                  />
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    Description:
                  </span>
                  <textarea
                    type="text"
                    placeholder="Enter project's description"
                    rows={4}
                    name="projectDescription"
                    onChange={onChange}
                    value={inputValues?.projectDescription ?? ""}
                    className="w-full py-2 px-4 rounded-3xl border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
                  />
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    Upload file
                  </span>
                  <input
                    type="file"
                    placeholder="Choose the worker for project"
                    className="hidden"
                    onChange={onFileSelect}
                    accept=".xlsx,.xls,.csv"
                    required
                  />
                  <div className="w-full rounded-3xl border-[1px] border-[#8C8C8C] bg-white h-40 flex flex-col items-center justify-center">
                    <img
                      className={`material-symbols-outlined w-10 h-12 ${
                        fileName ? "" : "animate-bounce"
                      }`}
                      src="./images/uploadFile.png"
                    />
                    <p>{fileName ? fileName : "Choose .xlsx file to upload"}</p>
                  </div>
                </label>

                <div className="mb-4 mt-2 lg:mt-0 text-right">
                  <Button
                    title={"Create Project"}
                    additionalClasses={
                      "border-2 transform hover:scale-105 transition-transform duration-300"
                    }
                  />
                </div>
              </form>
            </div>
            <div className="col-span-12 md:col-span-4 h-full order-first md:order-none">
              <div className="flex flex-col items-center mt-4 sm:mt-20">
                <img src="./images/taskIcon-lg.png" />
                <p className="font-semibold mt-2 text-xl h-5">
                  {inputValues?.projectName}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Layout>

      <Modal isOpen={isOpen} onClose={onClose}>
        <WorkerOverlay
          workers={workers}
          selectedWorkers={selectedWorkers}
          setSelectedWorkers={setSelectedWorkers}
        />
      </Modal>

      <Modal isOpen={openMessage} onClose={onCloseMessage}>
        <Message
          heading={"Message"}
          message={message}
          onClose={onCloseMessage}
        />
      </Modal>

      <Modal isOpen={openLoading}>
        <Spinner />
      </Modal>
    </>
  );
}

export default NewProject;
