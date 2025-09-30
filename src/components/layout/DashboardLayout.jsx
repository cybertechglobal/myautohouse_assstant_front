import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { useSidebarStore } from '../../store/sidebarStore';
import { useMediaQuery, useTheme } from '@mui/material';

export default function DashboardLayout({ children }) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getContentMargin = () => {
    if (isMobile) return 0;
    return isOpen ? '-240px' : '-75px';
  };

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          alignItems:'flex-start',
          minHeight: isMobile ? `calc(100vh - 156px)` : '100vh',
          paddingTop:  isMobile ? '80px' : '0',
          marginLeft: getContentMargin(),
          transition: 'margin 0.3s easy-in-out'
        }}
      >
        {children}
      </Box>
    </>
  );
}
