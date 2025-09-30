import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CompanyGroupCard({ group, onClick, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          minHeight: '150px',
          flex: 1,
          '&:hover': {
            backgroundColor: '#eff3f5',
            cursor: 'pointer',
          },
        }}
        onClick={() => onClick(group.id)}
      >
        <Box
          sx={{
            width: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
        >
          {group.logo_url && group.logo_url !== 'null' ? (
            <CardMedia
              component="img"
              sx={{ width: '100%', objectFit: 'contain' }}
              image={group.logo_url}
              alt={`${group.name} logo`}
            />
          ) : (
            <ImageNotSupportedIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CardContent
            sx={{ position: 'relative', pt: 1, pb: '16px !important' }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="start">
              <Typography variant="h6">{group.name}</Typography>
              <Tooltip title="More options">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box display="flex" alignItems="center">
              <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {`${group.address || ''}, ${group.city || ''}, ${group.country || ''}`}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <EmailIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{group.contact_email}</Typography>
            </Box>

            {group.description && (
              <Box display="flex" alignItems="center">
                <InfoIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontStyle="italic">
                  {group.description}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem
          sx={{ color: 'primary.main' }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(group);
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(group);
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
