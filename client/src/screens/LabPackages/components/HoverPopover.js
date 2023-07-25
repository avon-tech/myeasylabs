import { Popover, Table, TableBody, Typography } from "@mui/material";
import React from "react";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    packageName: {
        fontWeight: 600,
    },
    popover: {
        padding: "12px",
        minWidth: "350px",
    },
    totalPrice: {
        fontWeight: 600,
    },
}));
function HoverPopover(props) {
    const classes = useStyles();
    const { open, anchorEl, handlePopoverClose, selectedItem } = props;
    return (
        <Popover
            id="mouse-over-popover"
            open={open}
            anchorEl={anchorEl}
            sx={{
                pointerEvents: "none",
            }}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            disableRestoreFocus
        >
            {selectedItem && (
                <div className={classes.popover}>
                    <Typography className={classes.packageName}>
                        {selectedItem.packageName}
                    </Typography>
                    <Table>
                        <TableBody>
                            {selectedItem.packageDetails.map((item, idx) => (
                                <StyledTableRowSm key={idx}>
                                    <StyledTableCellSm>
                                        {item.lab_company_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.lab_company_test_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        &#36;
                                        {item.lab_company_test_price}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))}
                            <StyledTableRowSm>
                                <StyledTableCellSm align="right" colSpan={3}>
                                    <span className={classes.totalPrice}>
                                        Total:
                                    </span>{" "}
                                    &#36;
                                    {selectedItem.totalPrice}
                                </StyledTableCellSm>
                            </StyledTableRowSm>
                        </TableBody>
                    </Table>
                </div>
            )}
        </Popover>
    );
}

export default HoverPopover;
