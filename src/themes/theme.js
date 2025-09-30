import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Satoshi", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  palette: {
    primary: {
      main: '#0B7BB7',
    },
    customOverline: {
      main: '#FF5733',
    },
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#fff',
          fontWeight: '600',
        },
        root: {
          border: 0,
          borderRadius: 20,
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
        outlined: {
          border: '1px solid rgba(0, 0, 0, 0.7)',
          '&:hover': {
            border: '1px solid rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 2px 17px 0px #00000040',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 30px #d8f1fe inset !important;',
              WebkitTextFillColor: '#000 !important;',
            },
            '&:-webkit-autofill:focus': {
              WebkitBoxShadow: '0 0 0 30px #d8f1fe inset !important;',
              WebkitTextFillColor: '#000 !important;',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 30,
        },
        notchedOutline: {
          borderRadius: 30,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 30,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
      },
    },
  },
});

export default theme;
