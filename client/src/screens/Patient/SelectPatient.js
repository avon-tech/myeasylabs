import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ModelContainer from "../../components/common/ModelContainer";
import SelectPatientModal from "./components/SelectPatientModal";
import NewPatientModal from "./components/NewPatientModal";

export const StepEnum = {
    SELECT_PATIENT: "search",
    NEW_PATIENT: "new-patient",
    DASHBOARD: "dashboard",
};
function SelectPatient() {
    const [openedModal, setOpenedModal] = useState(StepEnum.SELECT_PATIENT);
    const [searchText, setSearchText] = useState("");
    const [patient, setPatient] = useState({
        lastName: "",
        firstName: "",
        email: "",
    });
    const history = useHistory();
    const handleNext = (step) => {
        if (step === StepEnum.DASHBOARD) {
            return history.push("/dashboard");
        }
        setOpenedModal(step);
    };

    const handleAddPatient = () => {
        if (searchText.includes("@")) {
            setPatient((prevPatient) => ({
                ...prevPatient,
                email: searchText,
            }));
        } else {
            setPatient((prevPatient) => ({
                ...prevPatient,
                lastName: searchText,
            }));
        }
        setOpenedModal(StepEnum.NEW_PATIENT);
    };

    return (
        <>
            <ModelContainer
                opened={openedModal === StepEnum.SELECT_PATIENT}
                closeModal={() => handleNext(StepEnum.DASHBOARD)}
            >
                <SelectPatientModal
                    handleAddPatient={handleAddPatient}
                    onClose={() => handleNext(StepEnum.DASHBOARD)}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </ModelContainer>
            <ModelContainer
                opened={openedModal === StepEnum.NEW_PATIENT}
                closeModal={() => handleNext(StepEnum.SELECT_PATIENT)}
            >
                <NewPatientModal
                    onClose={() => handleNext(StepEnum.SELECT_PATIENT)}
                    patient={patient}
                    setPatient={setPatient}
                />
            </ModelContainer>
        </>
    );
}

export default SelectPatient;
