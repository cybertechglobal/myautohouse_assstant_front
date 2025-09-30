import React from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DialogHeader = ({ title, onClose }) => {
  return (
    <DialogTitle sx={{ fontWeight: 600, position: 'relative' }}>
      {title}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[800],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default DialogHeader;
