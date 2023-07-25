import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import LabCompanies from "./LabCompanies";
import { StyledTableCellSm, StyledTableRowSm } from "./common/StyledTable";
import ModalPopup from "./ModalPopup";
import DetailModal from "../screens/Catalog/components/DetailModal";
import { API_BASE } from "../utils/constants";
import axios from "axios";
import authHeader from "../utils/helpers";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import { makeStyles } from "@mui/styles";
import useEffectOnce from "../hooks/useEffectOnce";
import Search from "./common/Search";

async function addFavorite(data) {
    return axios.post(`${API_BASE}/catalog/lab-company/favorite`, data, {
        headers: authHeader(),
    });
}
async function removeFavorite(id) {
    return axios.delete(`${API_BASE}/catalog/lab-company/favorite/${id}`, {
        headers: authHeader(),
    });
}
async function getLabCompanies() {
    const res = await axios.get(`${API_BASE}/catalog/lab-companies`, {
        headers: authHeader(),
    });
    return res.data;
}
const useStyles = makeStyles((theme) => ({
    tableContainer: {
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            width: 0,
        },
    },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
    topSection: {
        display: "flex",
        paddingBottom: theme.spacing(1),
        justifyContent: "space-between",
        alignItems: "end",
    },
    filterButton: {
        padding: theme.spacing(0) + " !important",
        color: theme.palette.text.blue + " !important",
        textTransform: "none !important",
        fontSize: "12px !important",
    },
    link: {
        color: theme.palette.text.primary,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    pointer: {
        cursor: "pointer",
    },
    hoverRow: {
        "&:hover": {
            backgroundColor: theme.Colors.border,
        },
    },
    iconButton: {
        width: "17px",
        height: "17px",
    },
}));
function LabAllTestContainer(props) {
    const classes = useStyles();
    const {
        isTestsLoading,
        onSearch,
        selectedCompanies,
        setSelectedCompanies,
        favoriteOnly,
        setFavoriteOnly,
        catalog,
        setCatalog,
        searchText,
        setSearchText,
        handleAddOrder = () => {},
        canAddOrder = false,
    } = props;
    const [labCompanies, setLabCompanies] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLabCompaniesLoading, setIsLabCompaniesLoading] = useState(false);

    const inputRef = useRef(null);

    const updateCatalogItem = (labCompanyTestId, favoriteId) => {
        setCatalog((prevCatalog) => {
            return prevCatalog.map((item) => {
                if (item.lab_company_test_id === labCompanyTestId) {
                    return { ...item, favorite_id: favoriteId };
                }
                return item;
            });
        });
    };
    const handleFavorite = (favoriteId, labCompanyTestId) => {
        if (favoriteId) {
            removeFavorite(labCompanyTestId)
                .then(() => updateCatalogItem(labCompanyTestId, null))
                .catch(() => console.log(""));
        } else {
            addFavorite({ labCompanyTestId })
                .then((res) =>
                    updateCatalogItem(
                        labCompanyTestId,
                        res.data.data.lab_company_test_id
                    )
                )
                .catch(() => console.log(""));
        }
    };

    const onCheckBoxChangeHandler = (e) => {
        const tempSelectedCompanies = [...selectedCompanies];
        if (e.target.checked) {
            tempSelectedCompanies.push(e.target.name);
            setSelectedCompanies([...tempSelectedCompanies]);
        } else {
            const index = selectedCompanies.findIndex(
                (x) => x === e.target.name
            );
            tempSelectedCompanies.splice(index, 1);
            setSelectedCompanies([...tempSelectedCompanies]);
        }
    };
    const fetchLabCompanies = useCallback(async (id) => {
        setIsLabCompaniesLoading(true);

        try {
            const res = await getLabCompanies();
            setLabCompanies(res.data);
            setIsLabCompaniesLoading(false);
        } catch (error) {
            setIsLabCompaniesLoading(false);
        }
    }, []);
    useEffectOnce(() => {
        fetchLabCompanies();
    }, []);
    const handleClearFilter = () => {
        setSelectedCompanies([]);
        setFavoriteOnly(false);
        setSearchText("");
        inputRef.current.focus();
    };

    const handleShowDetails = (lab) => {
        setSelectedItem(lab);
    };

    return (
        <>
            <Box className={classes.topSection}>
                {canAddOrder ? (
                    <div>
                        <Typography>All Tests</Typography>
                        <Button
                            className={classes.filterButton}
                            onClick={handleClearFilter}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <Button
                        className={classes.filterButton}
                        onClick={handleClearFilter}
                    >
                        Clear All Filters
                    </Button>
                )}

                <Search
                    placeholderText="Search test names..."
                    onFormSubmit={onSearch}
                    handleSearchClick={onSearch}
                    inputRef={inputRef}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </Box>
            <Grid container spacing={2}>
                <Grid item sm={3.1} xs={12}>
                    <Box className={classes.border} mb={1} pl={2}>
                        <FormControlLabel
                            label="Favorites Only"
                            className={classes.label}
                            control={
                                <Checkbox
                                    name="favorite"
                                    color="primary"
                                    size="small"
                                    checked={favoriteOnly}
                                    onChange={() =>
                                        setFavoriteOnly(!favoriteOnly)
                                    }
                                />
                            }
                        />
                    </Box>

                    <LabCompanies
                        isLoading={isLabCompaniesLoading}
                        catalogLabCompanies={labCompanies}
                        selectedCompanies={selectedCompanies}
                        onCheckBoxChangeHandler={onCheckBoxChangeHandler}
                    />
                </Grid>
                <Grid item sm={8.9} xs={12}>
                    <TableContainer className={classes.tableContainer}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <StyledTableRowSm>
                                    <StyledTableCellSm>
                                        Lab Company
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Test Name
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Favorite
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Sample
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>Price</StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Detail
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            </TableHead>
                            <TableBody>
                                {!isTestsLoading && catalog.length > 0 ? (
                                    catalog.map((item, idx) => (
                                        <StyledTableRowSm
                                            key={idx}
                                            className={classes.hoverRow}
                                        >
                                            <StyledTableCellSm
                                                className={
                                                    canAddOrder
                                                        ? classes.pointer
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handleAddOrder(item)
                                                }
                                            >
                                                {item.lab_company_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm
                                                className={
                                                    canAddOrder
                                                        ? classes.pointer
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handleAddOrder(item)
                                                }
                                            >
                                                {item.lab_company_test_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                <IconButton
                                                    size="small"
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    onClick={() =>
                                                        handleFavorite(
                                                            item.favorite_id,
                                                            item.lab_company_test_id
                                                        )
                                                    }
                                                >
                                                    {item.favorite_id ? (
                                                        <GradeIcon />
                                                    ) : (
                                                        <GradeOutlinedIcon />
                                                    )}
                                                </IconButton>
                                            </StyledTableCellSm>

                                            <StyledTableCellSm>
                                                {item.sample_type_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                &#36;{item.test_price}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm
                                                onClick={() =>
                                                    handleShowDetails(item)
                                                }
                                                className={
                                                    classes.iconContainer
                                                }
                                            >
                                                <ModalPopup
                                                    bodyElement={
                                                        selectedItem ? (
                                                            <DetailModal
                                                                data={
                                                                    selectedItem
                                                                }
                                                            />
                                                        ) : (
                                                            ""
                                                        )
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        className={
                                                            classes.iconButton
                                                        }
                                                    >
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </ModalPopup>
                                            </StyledTableCellSm>
                                        </StyledTableRowSm>
                                    ))
                                ) : (
                                    <StyledTableRowSm>
                                        <StyledTableCellSm colSpan={4}>
                                            <Typography
                                                align="center"
                                                variant="body1"
                                            >
                                                {isTestsLoading
                                                    ? "Loading..."
                                                    : "No Records Found..."}
                                            </Typography>
                                        </StyledTableCellSm>
                                    </StyledTableRowSm>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}

export default LabAllTestContainer;
