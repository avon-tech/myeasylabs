import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles((theme) => ({
    accordion: {
        boxShadow: "none !important",
        padding: theme.spacing(0),
        margin: theme.spacing(0),
        "& .MuiAccordionSummary-content.Mui-expanded, & .MuiAccordionSummary-content":
            {
                margin: theme.spacing(0),
            },
    },
    label: {
        "& span": {
            fontSize: "13px",
            whiteSpace: "nowrap",
            marginRight: "5px",
        },
        padding: theme.spacing(0.8, 1),
    },
    accordionSummary: {
        minHeight: "40px !important",
        padding: theme.spacing(0.5, 2, 0) + "!important",
    },
    accordionDetails: { padding: theme.spacing(0, 2, 2) + "!important" },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
    icon: {
        width: "17px",
        height: "17px",
    },
}));

function LabCompanies(props) {
    const {
        isLoading,
        catalogLabCompanies,
        selectedCompanies,
        onCheckBoxChangeHandler,
    } = props;
    const classes = useStyles();
    return (
        <Box className={classes.border}>
            <Accordion className={classes.accordion} defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.accordionSummary}
                >
                    <Typography component="h6" color="textPrimary" gutterBottom>
                        Lab Companies
                    </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    {!isLoading && catalogLabCompanies.length > 0 ? (
                        catalogLabCompanies.map((item) => (
                            <Grid key={item.id}>
                                <FormControlLabel
                                    value={item.id.toString()}
                                    label={item.name}
                                    className={classes.label}
                                    control={
                                        <Checkbox
                                            name={item.id.toString()}
                                            color="primary"
                                            size="small"
                                            className={classes.icon}
                                            checked={selectedCompanies.includes(
                                                item.id.toString()
                                            )}
                                            onChange={(e) =>
                                                onCheckBoxChangeHandler(e)
                                            }
                                        />
                                    }
                                />
                            </Grid>
                        ))
                    ) : (
                        <Typography align="center" variant="body1">
                            {isLoading ? "Loading..." : "No Lab Company"}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default LabCompanies;
