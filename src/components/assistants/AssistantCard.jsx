import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Box,
  CardActions,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import MicIcon from '@mui/icons-material/Mic';

export default function AssistantCard({
  assistant,
  onEdit,
  onDelete,
}) {
  const voice = assistant?.voices?.[0];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit();
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete();
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >

      <IconButton
        aria-label="more actions"
        aria-controls={open ? 'assistant-menu' : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        size="small"
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <MoreVertIcon />
      </IconButton>

      <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Avatar
          src={assistant.icon_url}
          alt={assistant.name}
          sx={{ width: 64, height: 64 }}
        />

        <Box flex={1}>
          <Typography variant="h6">{assistant.name}</Typography>
          {voice?.gender && (
            <Typography variant="body2" color="text.secondary">
              Gender: {voice.gender}
            </Typography>
          )}
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              <VolumeUpIcon
                color="primary"
                fontSize="inherit"
                sx={{ verticalAlign: 'middle', mr: 0.5 }}
              />
              {assistant.voices && assistant.voices.length > 0
                ? assistant.voices
                  .map((voice) => {
                    const name = voice.displayName || voice.name || 'No voice';
                    const gender = voice.gender ? ` (${voice.gender})` : '';
                    return `${name}${gender}`;
                  })
                  .join(', ')
                : 'No voices'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <LanguageIcon
                color='primary'
                fontSize="inherit"
                sx={{ verticalAlign: 'middle', mr: 0.5 }}
              />
              {assistant.supported_languages?.join(', ') || 'en'}
            </Typography>
            {assistant.virtual_office?.name && (
              <Typography variant="body2" color="text.secondary">
                <BusinessIcon
                  color='primary'
                  fontSize="inherit"
                  sx={{ verticalAlign: 'middle', mr: 0.5 }}
                />
                {assistant.virtual_office.name}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              <MicIcon color='primary' fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              TTS: {assistant.use_tts ? 'Enabled' : 'Disabled'}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          pb: 2,
        }}
      >
      </CardActions>

      <Menu
        id="assistant-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ color: 'primary.main' }}>
          <ListItemIcon>
            <EditIcon color='primary' />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color='error' />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
