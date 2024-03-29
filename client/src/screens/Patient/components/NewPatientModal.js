import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import ModelHeader from "../../../components/common/ModelHeader";
import TextFieldWithError from "../../../components/common/TextFieldWithError";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { StepEnum } from "../SelectPatient";
import axios from "axios";
import authHeader from "../../../utils/helpers";
import { API_BASE } from "../../../utils/constants";

const useStyles = makeStyles((theme) => ({
    newPatientContainer: {
        minWidth: "550px",
        padding: theme.spacing(3),
        "& input": {
            maxWidth: "250px !important",
            padding: theme.spacing(1.5),
        },
    },
    customButton: {
        color: theme.palette.black + " !important",
        textTransform: "Capitalize !important",
        borderColor: theme.palette.black + " !important",
    },
    buttons: {
        display: "flex",
        gap: theme.spacing(3),
        justifyContent: "center",
        marginTop: theme.spacing(3),
    },
    names: {
        display: "block !important",
    },
}));

async function createPatientRequest(data) {
    const res = await axios.post(`${API_BASE}/patient/create-patient`, data, {
        headers: authHeader(),
    });

    return res.data;
}

async function validatePatientEmailRequest(data) {
    return await axios.post(`${API_BASE}/patient/email/validate`, data, {
        headers: authHeader(),
    });
}
function NewPatientModal(props) {
    const classes = useStyles();
    const {
        onClose,
        patient: { lastName, firstName, email },
        setPatient,
    } = props;
    const history = useHistory();

    const [fieldErrors, setFieldErrors] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const getFieldError = (target, fieldName) => {
        let value = `client.${fieldName}`;
        if (target) {
            value = `${target}.${fieldName}`;
        }
        return fieldErrors && fieldErrors.filter((err) => err?.param === value);
    };
    const validateEmail = (event) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const isValid = emailRegex.test(event.target.value);

        if (!isValid) {
            setFieldErrors([
                ...fieldErrors,
                {
                    value: event.target.value,
                    msg: "Invalid email address",
                    param: "patient.email",
                },
            ]);
        } else {
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== "patient.email"
            );
            setFieldErrors(updatedErrors);
        }
        return isValid;
    };
    const handleAjaxValidation = async (event, target) => {
        if (!event.target) {
            return;
        }

        if (!validateEmail(event)) {
            return;
        }

        try {
            await validatePatientEmailRequest({
                email: event.target.value.trim().toLowerCase(),
            });
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== "patient.email"
            );
            setFieldErrors(updatedErrors);
        } catch (error) {
            if (!error.response) {
                console.error(error);
            } else {
                const uniqueFieldErrors = _.uniqWith(
                    [...fieldErrors, error.response.data.message],
                    _.isEqual
                );
                setFieldErrors(uniqueFieldErrors);
            }
        }
    };

    const handleSubmit = async (e, next) => {
        e.preventDefault();
        const data = {
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            email: email.trim(),
        };
        try {
            const res = await createPatientRequest(data);
            enqueueSnackbar(res.message, {
                variant: "success",
            });
            next === StepEnum.DASHBOARD
                ? history.push("/dashboard")
                : history.push(`/patient/${res.data.id}/new-order`);
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <ModelHeader onClose={onClose} title="New Patient" />
            <Box className={classes.newPatientContainer}>
                <form onSubmit={(e) => handleSubmit(e, StepEnum.ORDERS)}>
                    <TextField
                        value={firstName}
                        autoFocus
                        variant="outlined"
                        margin="dense"
                        className={classes.names}
                        id="firstName"
                        label="Firstname"
                        name="firstName"
                        autoComplete="firstName"
                        onChange={(event) =>
                            setPatient((prevPatient) => ({
                                ...prevPatient,
                                firstName: event.target.value,
                            }))
                        }
                        inputProps={{ maxLength: 35 }}
                        helperText={`${
                            firstName.length >= 35
                                ? "Enter a first name between 35 character"
                                : ""
                        }`}
                    />
                    <TextField
                        value={lastName}
                        variant="outlined"
                        margin="dense"
                        className={classes.names}
                        id="lastName"
                        label="Lastname"
                        name="lastName"
                        autoComplete="lastName"
                        onChange={(event) =>
                            setPatient((prevPatient) => ({
                                ...prevPatient,
                                lastName: event.target.value,
                            }))
                        }
                        inputProps={{ maxLength: 35 }}
                        helperText={`${
                            lastName.length >= 35
                                ? "Enter a last name between 35 character"
                                : ""
                        }`}
                    />
                    <TextFieldWithError
                        id="patientEmail"
                        fieldName="email"
                        label="Email"
                        value={email}
                        handleOnChange={(event) =>
                            setPatient((prevPatient) => ({
                                ...prevPatient,
                                email: event.target.value,
                            }))
                        }
                        handleOnBlur={(event) =>
                            handleAjaxValidation(event, "patient")
                        }
                        errors={getFieldError("patient", "email")}
                        inputProps={{ maxLength: 255 }}
                        helperText={`${
                            email.length >= 255
                                ? "Enter an email between 255 character"
                                : ""
                        }`}
                    />
                    <Box className={classes.buttons}>
                        {/*
                    <Button
                        variant="outlined"
                        className={classes.customButton}
                        onClick={(e) => handleSubmit(e, StepEnum.DASHBOARD)}
                    >
                        Create Patient
                    </Button>
                    */}
                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={!lastName || !firstName || !email}
                            className={classes.customButton}
                        >
                            {/*Create Order*/} Continue
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default NewPatientModal;
