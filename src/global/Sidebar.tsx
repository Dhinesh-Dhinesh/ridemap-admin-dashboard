import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

// Images
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

type props = {
    isVisible: boolean;
    activeMenu: string;
}

const SidebarReact: React.FC<props> = ({ isVisible, activeMenu }) => {

    const { collapseSidebar, collapsed } = useProSidebar();

    const mountedStyle = { animation: "inAnimation 250ms ease-in" };
    const unmountedStyle = {
        animation: "outAnimation 270ms ease-out",
        animationFillMode: "forwards"
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
                    <img src={logo} alt="logo" className='min-w-24 min-h-24 mx-auto my-5' />
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
                                    backgroundColor: active ? '#1f2937' : '#ffffff0d',
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
                                backgroundColor: '#ffffff0d',
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
                        component={<Link to="/users" />}
                        icon={<PersonIcon />}
                        active={activeMenu === ("/create-user" || "/delete-user")}
                    >
                        <MenuItem suffix={<AddCircleIcon />} component={<Link to="/create-user" />}> Create user </MenuItem>
                        <MenuItem suffix={<DeleteIcon />} component={<Link to="/delete-user" />}> Delete user </MenuItem>
                    </SubMenu>
                    <MenuItem icon={<SettingsIcon />} component={<Link to="/settings" />}> Settings </MenuItem>
                </Menu>
            </Sidebar>
        </Box>
    )
}

export default SidebarReact;