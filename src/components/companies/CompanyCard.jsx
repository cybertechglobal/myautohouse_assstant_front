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

export default function CompanyCard({ company, onClick, onEdit, onDelete }) {
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
        onClick={() => onClick(company.id)}
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
          {company.logo_url && company.logo_url !== 'null' ? (
            <CardMedia
              component="img"
              sx={{ width: '100%', objectFit: 'contain' }}
              image={company.logo_url}
              alt={`${company.name} logo`}
            />
          ) : (
            <ImageNotSupportedIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CardContent
            sx={{ position: 'relative', pt: 1, pb: '16px !important' }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Typography variant="h6">{company.name}</Typography>
              {/* Move the menu icon button outside of CardActionArea */}
              <Tooltip title="More options">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box display="flex" alignItems="center">
              <LocationOnIcon
                fontSize="small"
                color="primary"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="body2">
                {`${company.address || ''}, ${company.city || ''}, ${company.country || ''
                  }`}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <EmailIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{company.email}</Typography>
            </Box>

            {company.description && (
              <Box display="flex" alignItems="center">
                <InfoIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Typography variant="body2" fontStyle="italic">
                  {company.description}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Box>
      </Box>
      {/* Menu for options */}
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
            onEdit(company);
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: 'error.main' }}
          color='error'
          onClick={(e) => {
            e.stopPropagation();
            onDelete(company);
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1, }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
