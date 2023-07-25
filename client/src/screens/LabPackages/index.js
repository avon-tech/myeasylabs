import { Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import axios from "axios";

import useEffectOnce from "../../hooks/useEffectOnce";
import LabPackagesTable from "./components/LabPackagesTable";
import { API_BASE } from "../../utils/constants";
import authHeader from "../../utils/helpers";

export async function fetchLabPackagesRequest() {
    const res = await axios.get(`${API_BASE}/lab/packages`, {
        headers: authHeader(),
    });
    const sortedData = res.data.data
        .slice()
        .sort((a, b) => a.package_name.localeCompare(b.package_name));
    return sortedData;
}
const useStyles = makeStyles((theme) => ({
    pageTitle: {
        marginBottom: theme.spacing(3),
    },
    container: {
        marginLeft: theme.spacing(2) + "!important",
    },
}));

function LabPackages() {
    const classes = useStyles();
    const [labPackages, setLabPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchLabPackages() {
        try {
            setIsLoading(true);
            const data = await fetchLabPackagesRequest();
            setLabPackages(data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }
    useEffectOnce(() => {
        fetchLabPackages();
    }, []);

    return (
        <Container className={classes.container}>
            <Typography className={classes.pageTitle} variant="h5">
                Lab Packages
            </Typography>
            <LabPackagesTable isLoading={isLoading} labPackages={labPackages} />
        </Container>
    );
}

export default LabPackages;
