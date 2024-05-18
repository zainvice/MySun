import { useEffect, useState } from "react";
import { useModal } from "../../hooks";
import { useTranslation } from "react-i18next";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import DateInput from "../../common/dateInput";
import Button from "../../common/button";
import Modal from "../../common/modal";
import { createProject} from "../../api";
import { useWorkers } from "../../context/workersContext";
import WorkerOverlay from "../../components/workerOverlay";
import * as xlsx from "xlsx";
import Message from "../../common/message";
import jwtDecode from "jwt-decode";
import Spinner from "../../common/spinner";
import { useProjects } from "../../context/projectsContext";

function NewProject() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useModal();
  const [inputValues, setInputValues] = useState({});
  const { workers } = useWorkers()||{};
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [isCorrectStartDate, setCorrectStartDate] = useState(true);
  const [isCorrectEndDate, setCorrectEndDate] = useState(true);
  const [fileName, setFileName] = useState("");
  const [file2Name, setFile2Name] = useState("");
  const [message, setMessage] = useState("");
  const {reFetch} = useProjects()
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
        const rows = data.slice(1);
  
        const tasks = rows.map((row) => {
          const task = Object.create(null);
          header.forEach((headerItem, index) => {
            const data = row[index] || ''; // Handle empty values
            Object.assign(task, { [headerItem]: data });
          });
          return task;
        });
  
        setInputValues((prev) => ({
          ...prev,
          projectData: { tasks, completionPercentage: 0 },
        }));
      };
      console.log("SHOWING INPUT VALUES",inputValues)
    }
  };
  console.log("SHOWING INPUT VALUES",inputValues)

  const onFile2Select = (e) => {
    const file = e?.target?.files[0];
    setFile2Name(file?.name);

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
          buildingData: { tasks, completionPercentage: 0 },
        }));
      };
    }
  };

  const onSubmit = async(e) => {
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
    try {
      await createProject({
        ...inputValues,
        workers: selectedWorkers,
        admin: userInfo.email,
      })
      const tasks = inputValues.buildingData.tasks;
      /* onCloseLoading();
      onOpenMessage();
      setMessage(`PROJECT CREATED NOW, CREATING TASKS, PLEASE HOLD!`);
      for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMessage(`Creating tasks: Task ${i + 1} of ${tasks.length}!`);
      } */
      reFetch();
      setFileName("");
      setFile2Name("");
      setInputValues({});
      setSelectedWorkers([]);
      setMessage("Project created sccessfully!");
      onOpenMessage();
      onCloseLoading();
      window.location.reload()
    } catch (error) {
        const data = error?.response?.data;
        setMessage(data?.error ?? "Something went wrong!");
        onOpenMessage();
        onCloseLoading();
    }
    
     
     
     
  };

  return (
    <>
      <Layout activePageName={t("newProject.creatingNewProject")}>
        <Container>
          <div className="h-full grid grid-cols-12 gap-2 sm:gap-4 text-[#505050]">
            <div className="col-span-12  md:col-span-8 h-full">
              <Heading
                title={t("newProject.newProject")}
                additionalClases={"mb-2 lg:mb-8"}
              />
              <form
                className=" flex flex-col gap-2 lg:gap-6 lg:ml-14"
                onSubmit={onSubmit}
              >
                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                    {t("newProject.projectName")}
                  </span>
                  <input
                    type="text"
                    required
                    name="projectName"
                    value={inputValues?.projectName ?? ""}
                    onChange={onChange}
                    placeholder={t("newProject.enterProjectName")}
                    className="h-10 w-full py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
                  />
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                  {t("newProject.startDate")}:
                  </span>
                  <div className="w-full">
                    <DateInput
                      onChange={onChange}
                      required
                      value={inputValues?.startDate ?? ""}
                      placeholder=''
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
                  {t("newProject.endDate")}:
                  </span>
                  <div className="w-full">
                    <DateInput
                      onChange={onChange}
                      value={inputValues?.endDate ?? ""}
                      placeholder=''
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
                  <span className="md:w-1/4 text-lg font-medium">{t("newProject.workers")}</span>
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
                    placeholder={t("newProject.chooseWorkers")}
                    className="h-10 w-full py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2] cursor-pointer"
                  />
                </label>

                <label className="flex flex-col lg:flex-row gap-1">
                  <span className="md:w-1/4 text-lg font-medium">
                  {t("newProject.description")}:
                  </span>
                  <textarea
                    type="text"
                    required
                    placeholder={t("newProject.enterProjectsDescription")}
                    rows={4}
                    name="projectDescription"
                    onChange={onChange}
                    value={inputValues?.projectDescription ?? ""}
                    className="w-full py-2 px-4 rounded-3xl border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
                  />
                </label>

                <div className="flex flex-col lg:flex-row">
                <span className="w-1/2 text-lg font-medium">
                {t("newProject.uploadFiles")}:
                  </span>
                <label className="flex flex-col lg:flex-row gap-1 w-full lg-w-1/3 mr-5">
                  
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
                    <p>{fileName ? fileName : `${t("newProject.choosePropertyData")} (.xlsx)`}</p>
                  </div>
                </label>
                <label className="flex flex-col lg:flex-row w-full lg-w-1/3 lg:ml-3">
                 
                  <input
                    type="file"
                    placeholder="Choose the worker for project"
                    className="hidden"
                    onChange={onFile2Select}
                    accept=".xlsx,.xls,.csv"
                    required
                  />
                  <div className="w-full rounded-3xl border-[1px] border-[#8C8C8C] bg-white h-40 flex flex-col items-center justify-center">
                    <img
                      className={`material-symbols-outlined w-10 h-12 ${
                        file2Name ? "" : "animate-bounce"
                      }`}
                      src="./images/uploadFile.png"
                    />
                    <p>{file2Name ? file2Name : `${t("newProject.chooseBuildingData")} (.xlsx)`}</p>
                  </div>
                </label>
                </div>

                <div className="mb-4 mt-2 lg:mt-0 text-right">
                  <Button
                    title={t("newProject.createProject")}
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
          workers={workers?.filter((worker)=> worker?.role!=='admin')}
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
