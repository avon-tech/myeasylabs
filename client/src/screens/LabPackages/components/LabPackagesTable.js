import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";
import { makeStyles } from "@mui/styles";
import HoverPopover from "./HoverPopover";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.Colors.border,
        },
    },
    tableContainer: {
        position: "relative",
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            width: 0,
        },
    },
}));
function calculateTotalPrice(data) {
    return data.reduce((accumulator, item) => {
        const testPrice = parseFloat(item.lab_company_test_price);
        return accumulator + testPrice;
    }, 0);
}
function LabPackagesTable(props) {
    const classes = useStyles();
    const { labPackages, isLoading, handleClick = () => {} } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const handlePopoverOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        let totalPrice = calculateTotalPrice(item.packageDetails);

        setSelectedItem({ ...item, totalPrice: totalPrice });
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <TableContainer className={classes.tableContainer}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <StyledTableRowSm>
                            <StyledTableCellSm>Package</StyledTableCellSm>
                            <StyledTableCellSm>Status</StyledTableCellSm>
                            <StyledTableCellSm>Created</StyledTableCellSm>
                            <StyledTableCellSm>Updated</StyledTableCellSm>
                        </StyledTableRowSm>
                    </TableHead>
                    <TableBody>
                        {!isLoading && labPackages.length > 0 ? (
                            labPackages.map((packageItem) => (
                                <StyledTableRowSm
                                    aria-owns={
                                        open ? "mouse-over-popover" : undefined
                                    }
                                    aria-haspopup="true"
                                    key={packageItem.package_id}
                                    className={classes.tableRow}
                                    onMouseEnter={(event) =>
                                        handlePopoverOpen(event, {
                                            packageName:
                                                packageItem.package_name,
                                            packageDetails:
                                                packageItem.package_details,
                                        })
                                    }
                                    onMouseLeave={handlePopoverClose}
                                    onClick={() =>
                                        handleClick(packageItem.package_details)
                                    }
                                >
                                    <StyledTableCellSm>
                                        {packageItem.package_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {packageItem.status}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {packageItem.created}{" "}
                                        {packageItem.created_username}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {packageItem.updated}{" "}
                                        {packageItem.updated_username}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))
                        ) : (
                            <StyledTableRowSm>
                                <StyledTableCellSm colSpan={4}>
                                    <Typography align="center" variant="body1">
                                        {isLoading
                                            ? "Loading..."
                                            : "No Records Found..."}
                                    </Typography>
                                </StyledTableCellSm>
                            </StyledTableRowSm>
                        )}
                    </TableBody>
                </Table>
                <HoverPopover
                    open={open}
                    anchorEl={anchorEl}
                    handlePopoverClose={handlePopoverClose}
                    selectedItem={selectedItem}
                />
            </TableContainer>
        </>
    );
}

export default LabPackagesTable;
