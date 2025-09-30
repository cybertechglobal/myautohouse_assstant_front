import { Snackbar, Alert } from '@mui/material';
import { useGlobalSnackbarStore } from '../../../store/globalSnackbarStore';

const GlobalSnackbar = () => {
  const { open, message, severity, closeSnackbar } = useGlobalSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
