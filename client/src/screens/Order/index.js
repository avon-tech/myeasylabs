import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import ModelBody from "../../components/common/ModelBody";
import {
    Breadcrumbs,
    Button,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TestTable from "../../components/TestTable";
import catalogService from "../../services/catalog.service";
import Search from "../../components/common/Search";
import LabCompanies from "../../components/LabCompanies";
import OrderSuccessModal from "./components/OrderSuccessModal";
import Orders from "./components/Orders";
import CancelOrderModal from "./components/CancelOrderModal";
import orderService from "../../services/order.service";
import useEffectOnce from "../../hooks/useEffectOnce";
import patientService from "../../services/patient.service";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
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
        marginTop: theme.spacing(2),
    },
    searchContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
    testsContainer: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(1, 2),
    },

    filterButton: {
        padding: theme.spacing(0) + " !important",
        color: theme.palette.black + " !important",
        textTransform: "none !important",
        fontSize: "15px !important",
        marginBottom: theme.spacing(1) + " !important",
    },
    breadcrumbLink: {
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
}));

const Order = () => {
    const classes = useStyles();
    const { patientId, orderId } = useParams();
    const [catalog, setCatalog] = useState([]);
    const [favoriteCatalog, setFavoriteCatalog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [catalogLabCompanies, setCatalogLabCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [patient, setPatient] = useState(null);
    const [editMode] = useState(patientId && orderId);
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [cancelOrder, setCancelOrder] = useState(false);
    const history = useHistory();
    const inputRef = useRef(null);

    const fetchPatient = async () => {
        try {
            setIsLoading(true);
            const res = await patientService.getPatient(patientId);
            setPatient({ ...res.data, id: patientId });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchOrder = async (data) => {
        try {
            const res = await orderService.getOrderItems(orderId);
            const filteredItems = data.filter((item) =>
                res.data.some(
                    (idObj) =>
                        idObj.lab_company_test_id === item.lab_company_test_id
                )
            );

            return filteredItems;
        } catch (error) {
            setIsLoading(false);
        }
    };

    function calculateTotalPrice(data) {
        return data.reduce(
            (total, order) => total + parseFloat(order.test_price),
            0
        );
    }

    const fetchCatalogData = useCallback(
        async (text) => {
            setIsLoading(true);
            const reqBody = {
                data: {
                    text,
                    labCompanyId: selectedCompanies.length
                        ? selectedCompanies
                        : null,
                },
            };
            try {
                const res = await catalogService.searchCatalog(reqBody);
                const { data } = res;

                if (data && Array.isArray(data)) {
                    const favoriteCatalogs = data.filter(
                        (item) => item.favorite_id !== null
                    );
                    const normalCatalogs = data.filter(
                        (item) => item.favorite_id === null
                    );
                    setFavoriteCatalog(favoriteCatalogs);
                    setCatalog(normalCatalogs);
                    if (editMode && orders.length === 0) {
                        const orderItems = await fetchOrder(data);
                        const totalPrice = calculateTotalPrice(orderItems);
                        setTotalPrice(totalPrice);
                        setOrders(orderItems);
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedCompanies]
    );

    const fetchLabCompanies = useCallback(async (id) => {
        setIsLoading(true);

        try {
            const res = await catalogService.getLabCompanies();
            setCatalogLabCompanies(res.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }, []);
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
            catalogService
                .removeFavorite(labCompanyTestId)
                .then(() => updateCatalogItem(labCompanyTestId, null))
                .catch(() => setIsLoading(false));
        } else {
            catalogService
                .addFavorite({ labCompanyTestId })
                .then((res) =>
                    updateCatalogItem(
                        labCompanyTestId,
                        res.data.data.lab_company_test_id
                    )
                )
                .catch(() => setIsLoading(false));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchText.trim() !== "") {
            fetchCatalogData(searchText.trim());
        }
    };
    const handleSearchClick = () => {
        if (searchText.trim() !== "") {
            handleSearch(new Event("submit"));
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
    const handleGoToDashboard = () => {
        history.push("/dashboard");
    };
    const dataFetch = useRef(false);

    useEffect(() => {
        if (dataFetch.current) {
            fetchCatalogData(searchText);
        }
        dataFetch.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompanies]);
    useEffectOnce(() => {
        fetchPatient(patientId);
        fetchLabCompanies();
    }, [patientId]);
    const handleAddOrder = (item) => {
        const orderIndex = orders.findIndex(
            (order) => order.lab_company_test_id === item.lab_company_test_id
        );

        let updatedOrders;

        if (orderIndex >= 0) {
            updatedOrders = [...orders];
            updatedOrders.splice(orderIndex, 1);
            setOrders(updatedOrders);
        }

        if (orderIndex === -1) {
            updatedOrders = [...orders, item];
            setOrders(updatedOrders);
        }

        // Calculate the total price
        const calculatedTotalPrice = calculateTotalPrice(updatedOrders);
        setTotalPrice(calculatedTotalPrice);
    };
    const handleClearFilter = () => {
        setSelectedCompanies([]);
        setSearchText("");
        inputRef.current.focus();
    };

    const handleCancelOrder = async () => {
        if (editMode) {
            try {
                await orderService.updateOrderStatus({
                    order_id: orderId,
                });
                setOrders([]);
                setCancelOrder(false);
            } catch (error) {}
        } else {
            setOrders([]);
            setCancelOrder(false);
        }
    };
    const handleSubmitOrder = async () => {
        try {
            setIsLoading(true);
            await orderService.createOrders(patient.id, orders);
            setOrderSuccess(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <>
            {patient && patient.id && (
                <>
                    <Container className={classes.container}>
                        <Typography
                            component="h5"
                            variant="h5"
                            className={classes.pageTitle}
                        >
                            {editMode ? "Edit Order" : "New Order"} For
                            {` ${patient.firstname} ${patient.lastname}`}
                        </Typography>
                        <Stack spacing={2} mb={2} mt={1}>
                            <Breadcrumbs separator="›" aria-label="breadcrumb">
                                <RouterLink
                                    key="1"
                                    to="/dashboard"
                                    className={classes.breadcrumbLink}
                                >
                                    Dashboard
                                </RouterLink>
                                <RouterLink
                                    key="2"
                                    to={`/patient/${patient.id}/orders`}
                                    className={classes.breadcrumbLink}
                                >
                                    {patient.firstname + " " + patient.lastname}
                                </RouterLink>
                                <Typography key="3" color="text.primary">
                                    {editMode ? "Edit Order" : "New Order"}
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <Grid container>
                            <Grid item xs={9}>
                                <Grid mb={2} className={classes.testsContainer}>
                                    <Typography variant="h6">
                                        Favorite Tests
                                    </Typography>
                                    <TestTable
                                        isLoading={isLoading}
                                        catalog={favoriteCatalog}
                                        handleFavorite={handleFavorite}
                                        handleShowDetails={(item) =>
                                            setSelectedItem(item)
                                        }
                                        selectedItem={selectedItem}
                                        handleAddOrder={handleAddOrder}
                                    />
                                </Grid>
                                <Grid className={classes.testsContainer}>
                                    <Grid className={classes.searchContainer}>
                                        <Typography variant="h6">
                                            All Tests
                                        </Typography>
                                        <Search
                                            placeholderText="Search "
                                            onFormSubmit={handleSearch}
                                            handleSearchClick={
                                                handleSearchClick
                                            }
                                            inputRef={inputRef}
                                            searchText={searchText}
                                            setSearchText={setSearchText}
                                        />
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Button
                                                className={classes.filterButton}
                                                onClick={handleClearFilter}
                                            >
                                                Clear All Filters
                                            </Button>
                                            <LabCompanies
                                                catalogLabCompanies={
                                                    catalogLabCompanies
                                                }
                                                selectedCompanies={
                                                    selectedCompanies
                                                }
                                                onCheckBoxChangeHandler={
                                                    onCheckBoxChangeHandler
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TestTable
                                                isLoading={isLoading}
                                                catalog={catalog}
                                                handleFavorite={handleFavorite}
                                                handleShowDetails={(item) =>
                                                    setSelectedItem(item)
                                                }
                                                selectedItem={selectedItem}
                                                handleAddOrder={handleAddOrder}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <Orders
                                    editMode={editMode}
                                    orders={orders}
                                    totalPrice={totalPrice}
                                    setCancelOrder={setCancelOrder}
                                    handleAddOrder={handleAddOrder}
                                    handleSubmitOrder={handleSubmitOrder}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                    <CancelOrderModal
                        cancelOrder={cancelOrder}
                        setCancelOrder={setCancelOrder}
                        handleCancelOrder={handleCancelOrder}
                    />

                    <ModelBody
                        opened={orderSuccess}
                        closeModal={handleGoToDashboard}
                    >
                        <OrderSuccessModal
                            handleGoToDashboard={handleGoToDashboard}
                        />
                    </ModelBody>
                </>
            )}
        </>
    );
};

export default Order;
