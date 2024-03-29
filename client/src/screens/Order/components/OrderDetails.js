import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from "@mui/material";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";
import clsx from "clsx";
import CancelOrderModal from "./CancelOrderModal";
import { API_BASE } from "../../../utils/constants";
import authHeader from "../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },
    orderDetails: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(2, 1.5),
        marginBottom: theme.spacing(2),
    },
    flex: {
        display: "flex",
        alignItems: "center",
    },
    button: {
        border: `1px solid rgba(0, 0, 0, 0.23)`,
        borderRadius: "4px",
        color: theme.palette.black,
        backgroundColor: theme.palette.white,
        textDecoration: "none",
        padding: theme.spacing(1, 2),
        whiteSpace: "nowrap",
        fontSize: "12px",
        cursor: "pointer",
    },
    disabled: {
        pointerEvents: "none",
        color: theme.palette.text.secondary,
    },
    orderSummary: {
        "& p": {
            fontSize: "14.5px",
            fontWeight: 500,
            whiteSpace: "nowrap",
        },
        "& span": {
            fontWeight: 300,
            marginRight: theme.spacing(1.5),
            color: theme.palette.text.secondary,
        },
    },
    tableContainer: {
        maxWidth: "70%",
    },
}));

async function updateOrderStatusRequest(data) {
    const res = await axios.put(`${API_BASE}/order/update-order/status`, data, {
        headers: authHeader(),
    });
    return res.data;
}
export const OrderStatusEnum = {
    C: "C",
    STP: "STP",
};
function OrderDetails(props) {
    const classes = useStyles();
    const { orderItems, cancelOrder: updateOrderState, patientId } = props;
    const [cancelOrder, setCancelOrder] = useState(false);

    const handleUpdateOrder = async (status) => {
        try {
            await updateOrderStatusRequest({
                order_id: orderItems[0].order_id,
                status: status,
            });
            updateOrderState(orderItems[0].order_id, status);
            setCancelOrder(false);
        } catch (error) {
            setCancelOrder(true);
        }
    };

    return (
        <Box className={classes.orderDetails}>
            <Grid container mb={0.5}>
                <Grid
                    item
                    xs={8.5}
                    className={clsx(classes.flex, classes.orderSummary)}
                >
                    <Typography>
                        Order ID: <span>{orderItems[0].order_id}</span>
                    </Typography>
                    <Typography>
                        Created:{" "}
                        <span>
                            {orderItems[0].order_created}{" "}
                            {orderItems[0].order_created_user}
                        </span>
                    </Typography>
                    <Typography>
                        Updated: <span>{orderItems[0].order_updated}</span>
                    </Typography>
                    <Typography>
                        Status: <span>{orderItems[0].order_status}</span>
                    </Typography>
                </Grid>
                <Grid item xs={3.5} className={classes.flex} columnGap={2}>
                    {orderItems[0].order_status === "Sent To Patient" ? (
                        <RouterLink
                            to={`/patient/${patientId}/edit-order/${orderItems[0].order_id}`}
                            className={classes.button}
                        >
                            Edit Order
                        </RouterLink>
                    ) : (
                        <span
                            className={clsx(classes.button, classes.disabled)}
                        >
                            Edit Order
                        </span>
                    )}

                    {orderItems[0].order_status !== "Cancelled" ? (
                        <button
                            className={classes.button}
                            onClick={() => setCancelOrder(true)}
                        >
                            Cancel Order
                        </button>
                    ) : (
                        <button
                            className={classes.button}
                            onClick={() =>
                                handleUpdateOrder(OrderStatusEnum.STP)
                            }
                        >
                            UnCancel
                        </button>
                    )}
                    <RouterLink
                        to={`/patient/${patientId}/new-order`}
                        className={classes.button}
                    >
                        New Order
                    </RouterLink>
                </Grid>
            </Grid>
            <TableContainer className={classes.tableContainer}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <StyledTableRowSm>
                            <StyledTableCellSm>Lab Company</StyledTableCellSm>
                            <StyledTableCellSm>Test Name</StyledTableCellSm>
                            <StyledTableCellSm>Sample</StyledTableCellSm>
                            <StyledTableCellSm>Updated</StyledTableCellSm>
                            <StyledTableCellSm>Status</StyledTableCellSm>
                        </StyledTableRowSm>
                    </TableHead>
                    <TableBody>
                        {orderItems &&
                            orderItems.length > 0 &&
                            orderItems.map((item, idx) => (
                                <StyledTableRowSm key={idx}>
                                    <StyledTableCellSm>
                                        {item.lab_company_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.lab_company_test_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.sample_type_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.order_item_updated}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.order_item_status}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CancelOrderModal
                cancelOrder={cancelOrder}
                setCancelOrder={setCancelOrder}
                handleCancelOrder={() => handleUpdateOrder(OrderStatusEnum.C)}
            />
        </Box>
    );
}

export default OrderDetails;
