import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SectionHeader = ({ title, buttonText, onButtonClick, isSmallTitle }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={isSmallTitle ? 1 : 2}>
      <Typography variant={isSmallTitle ? 'h6' : 'h4'} gutterBottom>
        {title}
      </Typography>
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default SectionHeader;
