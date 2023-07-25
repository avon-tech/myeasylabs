import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import ModelContainer from "../../components/common/ModelContainer";
import {
    Box,
    Breadcrumbs,
    Button,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import FavoriteTestTable from "./components/FavoriteTestTable";
import OrderSuccessModal from "./components/OrderSuccessModal";
import Orders from "./components/Orders";
import CancelOrderModal from "./components/CancelOrderModal";
import useEffectOnce from "../../hooks/useEffectOnce";
import { API_BASE } from "../../utils/constants";
import authHeader from "../../utils/helpers";
import EditPatientModal from "../Patient/components/EditPatientModal";
import LabPackagesTable from "../LabPackages/components/LabPackagesTable";
import LabAllTestContainer from "../../components/LabAllTestContainer";
import { fetchLabPackagesRequest } from "../LabPackages";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },

    testsContainer: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(1, 2),
    },

    breadcrumbLink: {
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    breadcrumbs: {
        fontSize: "14px !important",
        "& p": {
            fontSize: "14px !important",
        },
    },
    flex: {
        display: "flex",
        alignItems: "center",
    },
    editButton: {
        padding: theme.spacing(0) + "!important",
        textTransform: "none !important",
        marginLeft: theme.spacing(2) + "!important",
    },
}));
async function searchCatalog(data) {
    const res = await axios.post(`${API_BASE}/catalog/search`, data, {
        headers: authHeader(),
    });
    return res.data;
}

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

async function createOrderRequest(patient_id, data) {
    const res = await axios.post(
        `${API_BASE}/order/${patient_id}/create-order`,
        { orders: data },
        {
            headers: authHeader(),
        }
    );
    return res.data;
}
async function updateOrderRequest(order_id, data) {
    const res = await axios.put(
        `${API_BASE}/order/${order_id}/update-order`,
        { orders: data },
        {
            headers: authHeader(),
        }
    );
    return res.data;
}
async function updateOrderStatusRequest(data) {
    const res = await axios.put(`${API_BASE}/order/update-order/status`, data, {
        headers: authHeader(),
    });
    return res.data;
}

async function getOrderItems(orderId) {
    const res = await axios.get(`${API_BASE}/order/${orderId}/order-items`, {
        headers: authHeader(),
    });
    return res.data;
}

async function getPatientRequest(patientId) {
    const res = await axios.get(`${API_BASE}/patient/${patientId}`, {
        headers: authHeader(),
    });
    return res.data;
}

const Order = () => {
    const classes = useStyles();
    const { patientId, orderId } = useParams();
    const [patient, setPatient] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [favoriteCatalog, setFavoriteCatalog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLabPackagesLoading, setIsLabPackagesLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [editMode] = useState(patientId && orderId);
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [cancelOrder, setCancelOrder] = useState(false);
    const [editPatient, setEditPatient] = useState(false);
    const [labPackages, setLabPackages] = useState([]);
    const [favoriteOnly, setFavoriteOnly] = useState(false);
    const [isEditingDisabled, setIsEditingDisable] = useState(false);
    const isFetching = useRef(false);

    const history = useHistory();
    const fetchPatient = async () => {
        try {
            setIsLoading(true);
            const res = await getPatientRequest(patientId);
            setPatient({ ...res.data, id: patientId });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    const isFetchingOrder = useRef(false);

    const fetchOrder = useCallback(async (id) => {
        if (!isFetchingOrder.current) {
            isFetchingOrder.current = true;
            try {
                const res = await getOrderItems(id);
                const totalPriceCalculated = calculateTotalPrice(res.data);
                setTotalPrice(totalPriceCalculated);
                setOrders(res.data);
                if (res.data[0].status !== "STP") setIsEditingDisable(true);
            } catch (error) {
                setIsLoading(false);
            } finally {
                isFetchingOrder.current = false;
            }
        }
    }, []);
    async function fetchLabPackages() {
        try {
            setIsLabPackagesLoading(true);
            const sortedData = await fetchLabPackagesRequest();
            setLabPackages(sortedData);
            setIsLabPackagesLoading(false);
        } catch (error) {
            setIsLabPackagesLoading(false);
        }
    }

    function calculateTotalPrice(data) {
        return data.reduce(
            (total, order) => total + parseFloat(order.test_price),
            0
        );
    }
    const fetchCatalogData = useCallback(async () => {
        if (!isFetching.current) {
            isFetching.current = true;
            setIsLoading(true);
            const reqBody = {
                data: {
                    text: searchText.trim(),
                    labCompanyId: selectedCompanies.length
                        ? selectedCompanies
                        : null,
                    favorite: favoriteOnly,
                },
            };
            try {
                const res = await searchCatalog(reqBody);
                const { data } = res;

                if (data && Array.isArray(data)) {
                    const updatedFavoriteCatalog = [...favoriteCatalog];

                    const newFavorites = data.filter(
                        (item) => item.favorite_id !== null
                    );

                    newFavorites.forEach((newFavorite) => {
                        const existingFavorite = updatedFavoriteCatalog.find(
                            (item) =>
                                item.favorite_id === newFavorite.favorite_id
                        );
                        if (!existingFavorite) {
                            updatedFavoriteCatalog.push(newFavorite);
                        }
                    });

                    setFavoriteCatalog(updatedFavoriteCatalog);
                    setCatalog(data);
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            } finally {
                isFetching.current = false;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompanies, favoriteOnly]);

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
                .catch(() => setIsLoading(false));
        } else {
            addFavorite({ labCompanyTestId })
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
        fetchCatalogData();
    };

    const handleGoToDashboard = () => {
        history.push("/dashboard");
    };

    useEffect(() => {
        fetchCatalogData();
        if (editMode && orders.length === 0) {
            fetchOrder(orderId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchCatalogData]);

    useEffectOnce(() => {
        fetchPatient(patientId);
        fetchLabPackages();
    }, [patientId]);

    const handleAddOrder = (item) => {
        if (isEditingDisabled) return;
        const orderIndex = orders.findIndex(
            (order) =>
                order.lab_company_test_id === item.lab_company_test_id &&
                order.lab_company_id === item.lab_company_id
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

        const calculatedTotalPrice = calculateTotalPrice(updatedOrders);
        setTotalPrice(calculatedTotalPrice);
    };

    const handleCancelOrder = async () => {
        if (editMode) {
            try {
                await updateOrderStatusRequest({
                    order_id: orderId,
                });
                setOrders([]);
                setCancelOrder(false);
                history.push("/dashboard");
            } catch (error) {}
        } else {
            setOrders([]);
            setCancelOrder(false);
        }
    };
    const handleSubmitOrder = async () => {
        try {
            setIsLoading(true);
            editMode
                ? await updateOrderRequest(orderId, orders)
                : await createOrderRequest(patient.id, orders);

            setOrderSuccess(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleEditButton = () => {
        setEditPatient(true);
    };

    const handleAddOrders = (items) => {
        if (isEditingDisabled) return;
        console.log({ isEditingDisabled });
        let modifiedItems = items.map((item) => ({
            ...item,
            test_price: item.lab_company_test_price,
        }));
        const filteredItems = modifiedItems.filter(
            (item) =>
                !orders.some(
                    (order) =>
                        order.lab_company_test_id ===
                            item.lab_company_test_id &&
                        order.lab_company_id === item.lab_company_id
                )
        );

        const updatedOrders = [...orders, ...filteredItems];
        setOrders(updatedOrders);

        const calculatedTotalPrice = calculateTotalPrice(updatedOrders);
        setTotalPrice(calculatedTotalPrice);
    };

    return (
        <>
            {patient && patient.id && (
                <>
                    <Container className={classes.container} maxWidth="xl">
                        <Typography
                            component="h5"
                            variant="h5"
                            className={classes.pageTitle}
                        >
                            {editMode ? "Edit Order" : "New Order"} For
                            {` ${patient.firstname} ${patient.lastname}`}
                        </Typography>
                        <Box className={classes.flex}>
                            <Typography variant="body2">
                                {patient.email}
                            </Typography>
                            <Button
                                variant="text"
                                className={classes.editButton}
                                onClick={handleEditButton}
                            >
                                Edit Patient
                            </Button>
                        </Box>
                        <Stack spacing={2} mb={2} mt={1}>
                            <Breadcrumbs
                                separator="›"
                                aria-label="breadcrumb"
                                className={classes.breadcrumbs}
                            >
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
                                    <Typography>Favorite Tests</Typography>
                                    <FavoriteTestTable
                                        catalog={favoriteCatalog}
                                        handleFavorite={handleFavorite}
                                        handleShowDetails={(item) =>
                                            setSelectedItem(item)
                                        }
                                        selectedItem={selectedItem}
                                        handleAddOrder={handleAddOrder}
                                    />
                                </Grid>
                                <Grid mb={2} className={classes.testsContainer}>
                                    <Typography>Lab Packages</Typography>
                                    <LabPackagesTable
                                        labPackages={labPackages}
                                        isLoading={isLabPackagesLoading}
                                        handleClick={(items) =>
                                            handleAddOrders(items)
                                        }
                                    />
                                </Grid>
                                <Grid className={classes.testsContainer}>
                                    <LabAllTestContainer
                                        isTestsLoading={isLoading}
                                        onSearch={handleSearch}
                                        selectedCompanies={selectedCompanies}
                                        setSelectedCompanies={
                                            setSelectedCompanies
                                        }
                                        canAddOrder={true}
                                        handleAddOrder={(item) =>
                                            handleAddOrder(item)
                                        }
                                        favoriteOnly={favoriteOnly}
                                        setFavoriteOnly={setFavoriteOnly}
                                        catalog={catalog}
                                        setCatalog={setCatalog}
                                        searchText={searchText}
                                        setSearchText={setSearchText}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <Orders
                                    editMode={editMode}
                                    orders={orders}
                                    totalPrice={totalPrice.toFixed(2)}
                                    setCancelOrder={setCancelOrder}
                                    handleAddOrder={handleAddOrder}
                                    handleSubmitOrder={handleSubmitOrder}
                                    isEditingDisabled={isEditingDisabled}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                    <CancelOrderModal
                        cancelOrder={cancelOrder}
                        setCancelOrder={setCancelOrder}
                        handleCancelOrder={handleCancelOrder}
                    />

                    <ModelContainer
                        opened={orderSuccess}
                        closeModal={handleGoToDashboard}
                    >
                        <OrderSuccessModal
                            handleGoToDashboard={handleGoToDashboard}
                        />
                    </ModelContainer>
                    <ModelContainer
                        opened={editPatient}
                        closeModal={() => setEditPatient(false)}
                    >
                        <EditPatientModal
                            onClose={() => setEditPatient(false)}
                            patient={patient}
                            setPatient={setPatient}
                        />
                    </ModelContainer>
                </>
            )}
        </>
    );
};

export default Order;
