import React, { useCallback, useEffect, useRef, useState } from "react";

import { Typography, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

import useDebounce from "../../hooks/useDebounce";

import axios from "axios";
import { API_BASE } from "../../utils/constants";
import authHeader from "../../utils/helpers";
import LabAllTestContainer from "../../components/LabAllTestContainer";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },
    pageTitle: {
        marginBottom: theme.spacing(3) + "!important",
    },

    filterButton: {
        padding: theme.spacing(0) + " !important",
        color: theme.palette.text.blue + " !important",
        textTransform: "none !important",
        fontSize: "12px !important",
    },
}));
async function searchCatalog(data) {
    const res = await axios.post(`${API_BASE}/catalog/search`, data, {
        headers: authHeader(),
    });
    return res.data;
}

const Catalog = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [favoriteOnly, setFavoriteOnly] = useState(false);

    const dataFetch = useRef(false);

    const debouncedSearchTerm = useDebounce(searchText, 500);

    const fetchCatalogData = useCallback(
        (text) => {
            setIsLoading(true);
            const reqBody = {
                data: {
                    text,
                    labCompanyId: selectedCompanies.length
                        ? selectedCompanies
                        : null,
                    favorite: favoriteOnly,
                },
            };
            searchCatalog(reqBody)
                .then((res) => {
                    setCatalog(res.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        },
        [favoriteOnly, selectedCompanies]
    );

    const onSearch = (e) => {
        e.preventDefault();
        fetchCatalogData(debouncedSearchTerm);
    };

    useEffect(() => {
        if (dataFetch.current) return fetchCatalogData(searchText);
        dataFetch.current = true;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favoriteOnly, selectedCompanies]);

    return (
        <Container className={classes.container}>
            <Typography
                component="h5"
                variant="h5"
                className={classes.pageTitle}
            >
                Catalog
            </Typography>

            <LabAllTestContainer
                isTestsLoading={isLoading}
                onSearch={onSearch}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
                favoriteOnly={favoriteOnly}
                setFavoriteOnly={setFavoriteOnly}
                catalog={catalog}
                setCatalog={setCatalog}
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </Container>
    );
};

export default Catalog;
