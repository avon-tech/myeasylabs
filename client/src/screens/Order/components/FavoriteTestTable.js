import {
    Typography,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";

import ModalPopup from "../../../components/ModalPopup";
import DetailModal from "../../Catalog/components/DetailModal";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            width: 0,
        },
    },

    iconContainer: {
        "& svg": {
            cursor: "pointer",
            position: "relative",
            top: 3,
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

function FavoriteTestTable(props) {
    const {
        catalog,
        handleFavorite,
        handleShowDetails,
        selectedItem,
        handleAddOrder,
    } = props;
    const classes = useStyles();
    return (
        <TableContainer className={classes.tableContainer}>
            <Table>
                <TableHead>
                    <StyledTableRowSm>
                        <StyledTableCellSm>Lab Company</StyledTableCellSm>
                        <StyledTableCellSm>Test Name</StyledTableCellSm>
                        <StyledTableCellSm>Sample</StyledTableCellSm>
                        <StyledTableCellSm>Price</StyledTableCellSm>
                        <StyledTableCellSm>Favorite</StyledTableCellSm>
                        <StyledTableCellSm>Detail</StyledTableCellSm>
                    </StyledTableRowSm>
                </TableHead>
                <TableBody>
                    {catalog.length > 0 ? (
                        catalog.map((item, idx) => (
                            <StyledTableRowSm
                                key={idx}
                                className={classes.hoverRow}
                            >
                                <StyledTableCellSm
                                    className={classes.pointer}
                                    onClick={() => handleAddOrder(item)}
                                >
                                    {item.lab_company_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm
                                    className={classes.pointer}
                                    onClick={() => handleAddOrder(item)}
                                >
                                    {item.lab_company_test_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm className={classes.pointer}>
                                    {item.sample_type_name}
                                </StyledTableCellSm>
                                <StyledTableCellSm className={classes.pointer}>
                                    &#36; {item.test_price}
                                </StyledTableCellSm>
                                <StyledTableCellSm>
                                    <IconButton
                                        size="small"
                                        className={classes.iconButton}
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

                                <StyledTableCellSm
                                    onClick={() => handleShowDetails(item)}
                                    className={classes.iconContainer}
                                >
                                    <ModalPopup
                                        bodyElement={
                                            selectedItem ? (
                                                <DetailModal
                                                    data={selectedItem}
                                                />
                                            ) : (
                                                ""
                                            )
                                        }
                                    >
                                        <IconButton
                                            size="small"
                                            className={classes.iconButton}
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
                                <Typography align="center" variant="body1">
                                    No Favorites Found
                                </Typography>
                            </StyledTableCellSm>
                        </StyledTableRowSm>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FavoriteTestTable;
