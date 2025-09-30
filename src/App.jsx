import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import AppRouter from './routes/Router';
import {
  Box,
  CircularProgress,
} from '@mui/material';

import GlobalSnackbar from './components/common/snackbar/GlobalSnackbar.jsx';

function App() {
  const user = useAuthStore((state) => state.user);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const loadUserFromStorage = useAuthStore(
    (state) => state.loadUserFromStorage
  );



  useEffect(() => {
    if (!isAuthChecked) {
      loadUserFromStorage();
    }
  }, [isAuthChecked, loadUserFromStorage]);


  if (!isAuthChecked) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <BrowserRouter>
      {user && <Sidebar />}
        <AppRouter />
      <GlobalSnackbar/>
    </BrowserRouter>
  );
}

export default App;
