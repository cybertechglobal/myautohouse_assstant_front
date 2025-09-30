import { Snackbar, Alert } from '@mui/material';
import { useGlobalErrorStore } from '../../../store/globalErrorStore';

const GlobalErrorSnackbar = () => {
  const { message, open, closeError } = useGlobalErrorStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={closeError}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorSnackbar;
