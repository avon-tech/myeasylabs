import React from "react";

import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ModelHeader from "../../../components/common/ModelHeader";

const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: "500 !important",
        color: theme.palette.black + "!important",
        fontSize: "16px !important",
        whiteSpace: "nowrap",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        marginLeft: theme.spacing(1),
    },
    closeButton: {
        borderColor: theme.palette.black + " !important",
        color: theme.palette.black + " !important",
        padding: theme.spacing(0, 2) + " !important",
        "& span": {},
    },
    title: {
        fontSize: "16px !important",
        fontWeight: 600 + "!important",
        color: theme.Colors.black,
    },
    tableRow: {
        "&:last-child td": {
            borderBottom: "none !important",
            padding: theme.spacing(0) + " !important",
        },
    },

    table: {
        "& td": {
            borderBottom: "none !important",
            padding: theme.spacing(0.7, 0) + "!important",
        },
    },
}));

const DetailModal = ({ data, onClose }) => {
    const classes = useStyles();
    const {
        lab_company_name,
        lab_company_test_name,
        test_price,
        sample_type_name,
    } = data;

    return (
        <Box minWidth={550} paddingX={1} pt={0}>
            <ModelHeader onClose={onClose} title="Lab Company Test Detail" />
            <Box paddingY={2}>
                <Table className={classes.table}>
                    <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                            <TableCell className={classes.label}>
                                Lab Company
                            </TableCell>
                            <TableCell className={classes.text}>
                                {lab_company_name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.label}>
                                Test Name
                            </TableCell>
                            <TableCell className={classes.text}>
                                {lab_company_test_name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.label}>
                                Sample
                            </TableCell>
                            <TableCell className={classes.text}>
                                {sample_type_name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.label}>
                                Price
                            </TableCell>
                            <TableCell className={classes.text}>
                                &#36;{test_price}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default DetailModal;
