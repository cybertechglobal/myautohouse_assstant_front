import { useGlobalSnackbarStore } from '../../store/globalSnackbarStore';

export const notifySuccess = (msg) =>
  useGlobalSnackbarStore
    .getState()
    .showSnackbar({ message: msg, severity: 'success' });

export const notifyError = (msg) =>
  useGlobalSnackbarStore
    .getState()
    .showSnackbar({ message: msg, severity: 'error' });

export const notifyInfo = (message) =>
  useGlobalSnackbarStore.getState().showSnackbar(message, 'info');
