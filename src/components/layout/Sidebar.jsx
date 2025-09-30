import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  useMediaQuery,
  Divider,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PaymentsIcon from '@mui/icons-material/Payments';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';

import Logo from '../../assets/logo.png';

const roleLinks = {
  root: [
    { path: '/company-groups', label: 'Auto House Groups', icon: <BusinessIcon /> },
    { path: '/companies', label: 'Auto Houses', icon: <OtherHousesIcon /> },
    { path: '/voices', label: 'Voices', icon: <SettingsVoiceIcon /> },
    { path: '/packages', label: 'Packages', icon: <PaymentsIcon /> },
    { path: '/features', label: 'Features', icon: <SettingsSuggestIcon /> },
    /* { path: '/conversations', label: 'Conversations', icon: <ForumIcon />* },*/
    { path: '/event-logs', label: 'Event Logs', icon: <HistoryIcon /> }
  ],
  group_admin: [
    { path: '/companies', label: 'Auto Houses', icon: <OtherHousesIcon /> },
  ],
  admin: [
    { path: '/assistants', label: 'Assistants', icon: <PeopleAltIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
    { path: '/summaries', label: 'Summaries', icon: <SummarizeIcon /> },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isOpen, toggle, mobileOpen, toggleMobile, closeMobile } = useSidebarStore();

  const getLinksForUser = () => {
    const role = user?.role;
    if (!role) return [];

    return roleLinks[role] || [];
  };

  const links = getLinksForUser();

  const handleLinkClick = (path) => {
    navigate(path);
    if (isMobile) closeMobile();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) closeMobile();
  };

  const drawerWidth = 245;
  const collapsedWidth = 72;

  return (
    <>
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '95%',
            height: 56,
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            boxShadow: 0,
            borderBottom: '1px solid #ccc',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Box component="img" src={Logo} alt="Logo" sx={{ height: 30 }} />
          <IconButton onClick={toggleMobile}>
            {mobileOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : isOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? drawerWidth : isOpen ? drawerWidth : collapsedWidth,

          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? drawerWidth : isOpen ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            backgroundColor: isMobile ? '#ffffff' : 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, paddingTop: '20px', }}>
              <Box
                component="img"
                src={Logo}
                alt="Logo"
                sx={{
                  width: 140,
                  display: isOpen ? 'block' : 'none',

                }}
              />
              <IconButton onClick={toggle} size="small" sx={{ ml: isOpen ? 1 : 0 }}>
                {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}

          <List sx={{ width: '100%', mt: isMobile ? '80px' : '50px', }}>
            {links.map((link) => (
              <Tooltip title={!isOpen && !isMobile ? link.label : ''} placement="right" key={link.path}>
                <ListItem
                  onClick={() => handleLinkClick(link.path)}
                  sx={{
                    justifyContent: isOpen || isMobile ? 'flex-start' : 'center',
                    borderRadius: '30px',
                    my: 0.5,
                    px: 2,
                    backgroundColor:
                      window.location.pathname.includes(link.path) ? theme.palette.primary.main : 'transparent',
                    color: window.location.pathname.includes(link.path) ? '#fff' : 'text.secondary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: window.location.pathname.includes(link.path) ? theme.palette.primary.main : '#ccc',
                      cursor: 'pointer'
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 0,
                      mr: isOpen || isMobile ? 2 : 0,
                      justifyContent: 'center',
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  {(isOpen || isMobile) && (
                    <ListItemText
                      primary={link.label}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: 1,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>

        {/* Logout */}
        <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: isOpen || isMobile ? 'flex-start' : 'center' }}>
          <ListItem
            onClick={handleLogout}
            sx={{
              borderRadius: '30px',
              '&:hover': {
                backgroundColor: '#ccc',
                cursor: 'pointer',
              },
              justifyContent: isOpen || isMobile ? 'flex-start' : 'center',
            }}
          >
            <ListItemIcon
              sx={{
                color: 'text.secondary',
                minWidth: 0,
                mr: isOpen || isMobile ? 2 : 0,
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {(isOpen || isMobile) && (
              <ListItemText
                primary="Logout"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  opacity: 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
            )}
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
}
