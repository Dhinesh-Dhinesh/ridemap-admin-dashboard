import { Box, IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useProSidebar } from "react-pro-sidebar";

const Topbar = () => {

    const { toggleSidebar, broken } = useProSidebar();

    return (
        <Box display="flex" justifyContent="space-between" m={2}>
            <Box display="flex">
                {broken && (
                    <IconButton
                        sx={{ margin: "0 6 0 2" }}
                        onClick={() => toggleSidebar()}
                    >
                        <MenuOutlinedIcon />
                    </IconButton>
                )}
            </Box>
            <Box display="flex">
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <PersonOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;
