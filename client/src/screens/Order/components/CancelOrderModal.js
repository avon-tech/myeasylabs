import React, { useEffect, useRef } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    active: {
        backgroundColor: theme.Colors.iconBackGround,
    },
}));
function CancelOrderModal(props) {
    const classes = useStyles();
    const { cancelOrder, setCancelOrder, handleCancelOrder } = props;
    const yesButtonRef = useRef(null);

    useEffect(() => {
        // When the modal is opened, focus the "Yes" button after a delay
        if (cancelOrder) {
            const timeoutId = setTimeout(() => {
                if (yesButtonRef.current) {
                    yesButtonRef.current.focus();
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [cancelOrder]);

    return (
        <Dialog open={cancelOrder} onClose={() => setCancelOrder(false)}>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to cancel this order?</p>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancelOrder}
                    ref={yesButtonRef}
                    className={classes.active}
                >
                    Yes
                </Button>
                <Button onClick={() => setCancelOrder(false)}>No</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CancelOrderModal;
