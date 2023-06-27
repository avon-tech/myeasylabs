import { TableCell, TableRow } from "@mui/material";
import { withStyles } from "@mui/styles";

export const StyledTableCellLg = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.grey,
        color: theme.palette.grey,
        fontSize: "12px",
        fontWeight: 700,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export const StyledTableCellSm = withStyles((theme) => ({
    head: {
        whiteSpace: "nowrap",
        fontSize: "16px",
        fontWeight: 700 + "!important",
        padding: "6px 24px 6px 2px",
        borderBottom: "unset",
        background: "white",
        color: theme.palette.text.secondary + "!important",
    },
    body: {
        fontSize: 12,
        borderBottom: "unset",
    },
}))(TableCell);

export const StyledTableRowSm = withStyles((theme) => ({
    root: {
        "& p": {
            fontSize: 12,
            lineHeight: "21px",
        },
        fontSize: 14,
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        "& th": {
            fontSize: 12,
            whiteSpace: "nowrap",
            padding: "2px 16px 2px 2px",
        },
        "& td": {
            fontSize: 12,
            whiteSpace: "nowrap",
            padding: "2px 16px 2px 2px",
        },
    },
}))(TableRow);

export const StyledTableRowLg = withStyles((theme) => ({
    root: {
        fontSize: 14,
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        "& th": {
            fontSize: 12,
        },
        "& td": {
            fontSize: 12,
            height: "50px",
        },
    },
}))(TableRow);
