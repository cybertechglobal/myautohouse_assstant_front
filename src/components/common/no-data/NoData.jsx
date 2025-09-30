import { Box, Typography, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';

export default function NoData({
  message = 'No data found.',
  icon = <InfoIcon sx={{ fontSize: 48, color: '#ccc' }} />,
  actionText,
  onAction,
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      textAlign="center"
      mt={4}
    >
      {icon}
      <Typography variant="body1" sx={{ mt: 1, mb: 2, color: '#777' }}>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained"  startIcon={<AddIcon />} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
