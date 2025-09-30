// components/settings/IntegrationSnippet.jsx

import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { notifySuccess, notifyError } from '../../helpers/utils/notify';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

const IntegrationSnippet = ({ companyId }) => {
  const widgetScript = `<script src="http://dev.myautohouse.eu/virtual-office-button/widget.js" autohouse-id="${companyId}"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(widgetScript);
      notifySuccess("Code copied to clipboard!");
    } catch (err) {
      notifyError("Something went wrong while copying.");
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IntegrationInstructionsIcon fontSize="inherit" />
        Integration Code
      </Typography>
      <Typography variant="body2" gutterBottom>
        Copy the code below and paste it before the closing <code>{'</body>'}</code> tag on your website:
      </Typography>

      <TextField
        multiline
        fullWidth
        minRows={3}
        value={widgetScript}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Tooltip title="Copy code">
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          )
        }}
        sx={{ my: 2 }}
      />

      <Typography variant="caption" color="textSecondary">
        This script displays a floating button in the bottom-right corner that links to your virtual office.
      </Typography>
    </Box>
  );
};

export default IntegrationSnippet;
