import React from 'react';
import { Box, CircularProgress } from '@mui/material';


const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <CircularProgress size={50} sx={{ marginBottom: 2 }} />
    </Box>
  );
};

export default Loading;
