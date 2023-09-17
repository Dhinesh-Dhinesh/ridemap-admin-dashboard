import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

// Images
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { auth } from '../firebase';

// MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

type props = {
    isVisible: boolean;
    activeMenu: string;
}

const SidebarReact: React.FC<props> = ({ isVisible, activeMenu }) => {

    const { collapseSidebar, collapsed } = useProSidebar();
    const navigate = useNavigate();

    const mountedStyle = { animation: "inAnimation 250ms ease-in" };
    const unmountedStyle = {
        animation: "outAnimation 270ms ease-out",
        animationFillMode: "forwards"
    };

    const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);

    const handleSignout = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirmed = async () => {
        try {
            await auth.signOut(); // Sign out the user
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setLogoutDialogOpen(false); // Close the dialog
        }
    };

    return (
        <Box
            sx={{
                position: "sticky",
                display: `${isVisible ? "flex" : "none"}`,
                height: "100vh",
                top: 0,
                bottom: 0,
                zIndex: 10000,
            }}
            style={isVisible ? mountedStyle : unmountedStyle}
        >
            <Sidebar
                backgroundColor="#212631"
                breakPoint='md'
                transitionDuration={500}
            >
                {/* Logo container */}
                <div className='flex flex-col justify-center items-center' onClick={() => {
                    collapseSidebar()
                }}>
                    <img src={logo} alt="logo" className='max-w-24 max-h-24 mx-auto my-5 p-2' />
                    <p className="text-white mb-6">Ridemap</p>
                </div>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active }) => {
                            if (level === 0)
                                return {
                                    color: active ? '#ffffff' : '#aab3c5',
                                    backgroundColor: active ? '#ffffff0d' : undefined,
                                    transition: 'all 0.2s ease-in-out',
                                    ':hover': {
                                        backgroundColor: '#1f2937',
                                        animation: 'text-animation 0.2s ease-in-out',
                                    }
                                };
                        },
                        subMenuContent: ({ level, active }) => {
                            if (level === 0)
                                return {
                                    color: active ? '#ffffff' : '#aab3c5',
                                    backgroundColor: active ? '#1f2937' : '#1f2937',
                                    transition: 'all 0.2s ease-in-out',
                                    '.ps-menu-button': {
                                        backgroundColor: '#ffffff0d',
                                        '&:hover': {
                                            backgroundColor: '#1f2937',
                                            animation: 'text-animation 0.2s ease-in-out',
                                        },
                                    },
                                };
                        },
                        root: {
                            '.ps-menu-button:hover': {
                                '&:hover': {
                                    backgroundColor: '#1f2937',
                                    animation: 'text-animation 0.8s ease-in-out',
                                },
                            },
                        }
                    }}
                >
                    <MenuItem icon={<DashboardIcon />} active={activeMenu === "/dashboard"} component={<Link to="/dashboard" />}> Dashboard </MenuItem>
                    {collapsed ? '' : <>
                        <div className='h-px w-full bg-gray-700 my-2' />
                        <div className='text-sm text-white ml-3 p-2'>Admin</div>
                    </>
                    }
                    <MenuItem icon={<AdminPanelSettingsIcon />} component={<Link to="/admin" />}> Admin </MenuItem>
                    <SubMenu
                        label="Users"
                        icon={<PersonIcon />}
                        active={["/create-user", "/search-user", "/users"].includes(activeMenu)}
                    >
                        <MenuItem suffix={<AddCircleIcon />} component={<Link to="/create-user" />}> Create user </MenuItem>
                        <MenuItem suffix={<PersonSearchIcon />} component={<Link to="/search-user" />}> Search user </MenuItem>
                        <MenuItem suffix={<InsertDriveFileIcon />} component={<Link to="/users" />}> User records </MenuItem>
                    </SubMenu>
                    <MenuItem icon={<SettingsIcon />} component={<Link to="/settings" />}> Settings </MenuItem>
                </Menu>
                <div className='absolute bottom-0 flex justify-center items-center w-full flex-col m-1 text-white'>
                    <Button sx={{ color: "white" }} startIcon={<LogoutIcon />} onClick={handleSignout}>
                        {collapsed ? '' : <>
                            <div className='h-px w-full bg-gray-700 my-2' />
                            <div className='text-sm text-white ml-3 p-2'>Logout</div>
                        </>
                        }
                    </Button>
                </div>
            </Sidebar>
            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                        p: {
                            xs: '1rem',
                        }
                    },
                }}
            >
                <DialogTitle>Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogoutConfirmed} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SidebarReact;