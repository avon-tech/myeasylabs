import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddchartIcon from "@mui/icons-material/Addchart";
import ScienceIcon from "@mui/icons-material/Science";

const navIconStyles = { color: "#FFF", fontSize: "20px" };
export const client_pages = [
    {
        id: 1,
        title: "Dashboard",
        href: "/dashboard",
        icon: <HomeIcon style={navIconStyles} />,
    },
    {
        id: 2,
        icon: <AddchartIcon style={navIconStyles} />,
        title: "New Order",
        href: "/new-order",
    },
    {
        id: 3,
        icon: <ListAltIcon style={navIconStyles} />,
        title: "Catalog",
        href: "/catalog",
    },
    {
        id: 4,
        icon: <ScienceIcon style={navIconStyles} />,
        title: "Lab Packages",
        href: "/lab-packages",
    },
    {
        id: 4,
        icon: <PersonIcon style={navIconStyles} />,
        title: "Myself",
        href: "/myself",
    },
    {
        id: 5,
        icon: <LocationCityIcon style={navIconStyles} />,
        title: "Client",
        href: "/client-profile",
    },
    {
        id: 6,
        icon: <ExitToAppIcon style={navIconStyles} />,
        title: "Logout",
        href: "/",
        logout: true,
    },
];
