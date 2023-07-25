import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableHead,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ModelHeader from "../../../components/common/ModelHeader";
import Search from "../../../components/common/Search";
import { API_BASE } from "../../../utils/constants";
import axios from "axios";
import authHeader from "../../../utils/helpers";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";

const useStyles = makeStyles((theme) => ({
    selectPatientContainer: {
        position: "relative",
        minWidth: "550px",
        minHeight: "300px",
        padding: theme.spacing(3, 5, 4, 5),
    },
    addButton: {
        position: "absolute !important",
        bottom: theme.spacing(1),
        color: theme.palette.text.primary + "! important",
        fontSize: "17px ! important",
        textTransform: "none ! important",
        padding: theme.spacing(0, 0.5) + "! important",
    },
    flex: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        width: "100%",
    },
    searchButton: {
        color: theme.palette.text.primary + "! important",
        borderColor: theme.palette.text.primary + "! important",
    },
    searchInput: {
        minWidth: "350px !important",
    },
    table: {
        marginTop: theme.spacing(1),
    },
}));

async function getPatientsRequest(data) {
    const res = await axios.post(`${API_BASE}/patient/search`, data, {
        headers: authHeader(),
    });
    return res.data;
}
function SelectPatientModal(props) {
    const classes = useStyles();
    const { onClose, handleAddPatient, searchText, setSearchText } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [patients, setPatients] = useState([]);
    const history = useHistory();
    const fetchPatientData = async () => {
        setIsLoading(true);
        const data = { term: searchText.toLowerCase() };
        try {
            const res = await getPatientsRequest(data);
            setPatients(res.data);
            setIsLoading(false);
        } catch (error) {
            setPatients([]);
            setIsLoading(false);
        }
    };
    const onFormSubmit = (e) => {
        e.preventDefault();
        fetchPatientData(searchText);
    };

    const handleSelect = (patientId) => {
        history.push(`/patient/${patientId}/new-order`);
    };
    return (
        <>
            <ModelHeader
                onClose={onClose}
                title="Select or Create New Patient"
            />
            <Box className={classes.selectPatientContainer}>
                <div className={classes.flex}>
                    <Search
                        placeholderText="Search Patient names..."
                        onFormSubmit={onFormSubmit}
                        handleSearchClick={onFormSubmit}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        classNames={classes.searchInput}
                    />
                    <Button
                        variant="outlined"
                        className={classes.searchButton}
                        onClick={onFormSubmit}
                    >
                        Search
                    </Button>
                </div>
                {!isLoading && patients.length > 0 ? (
                    <Table stickyHeader size="small" className={classes.table}>
                        <TableHead>
                            <StyledTableRowSm>
                                <StyledTableCellSm>FirstName</StyledTableCellSm>
                                <StyledTableCellSm>LastName</StyledTableCellSm>
                                <StyledTableCellSm>Email</StyledTableCellSm>
                            </StyledTableRowSm>
                        </TableHead>
                        <TableBody>
                            {patients.map((patient) => (
                                <StyledTableRowSm
                                    key={patient.email}
                                    onClick={() => handleSelect(patient.id)}
                                >
                                    <StyledTableCellSm>
                                        {patient.firstname}
                                    </StyledTableCellSm>

                                    <StyledTableCellSm>
                                        {patient.lastname}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {patient.email}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography align="center" variant="body1">
                        {isLoading && "Loading..."}
                    </Typography>
                )}
                {searchText.length > 0 && (
                    <Button
                        variant="text"
                        onClick={() => handleAddPatient("NEW_PATIENT")}
                        className={classes.addButton}
                    >
                        Add {searchText} as a Patient
                    </Button>
                )}
            </Box>
        </>
    );
}

export default SelectPatientModal;
