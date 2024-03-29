import { colors } from "@mui/material";

const white = "#FFFFFF";
const black = "#000000";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    black,
    white,
    primary: {
        contrastText: white,
        dark: colors.blue[900],
        main: colors.blue.A400,
        light: colors.blue.A400,
    },
    secondary: {
        contrastText: white,
        dark: colors.indigo[900],
        main: colors.indigo[500],
        light: colors.indigo[100],
    },
    success: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[400],
    },
    warning: {
        contrastText: white,
        dark: colors.orange[900],
        main: colors.orange[600],
        light: colors.orange[400],
    },
    error: {
        contrastText: white,
        dark: colors.red[900],
        main: colors.red[600],
        light: colors.red[400],
    },
    text: {
        primary: colors.blueGrey[800],
        secondary: colors.blueGrey[600],
        link: colors.blue[600],
    },

    divider: colors.grey[200],
    borderColor: colors.grey[200],
};
