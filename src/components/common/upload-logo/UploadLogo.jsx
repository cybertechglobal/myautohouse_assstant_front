import * as React from 'react';
import { ButtonBase, Avatar, Typography, Grid } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

export default function UploadLogo({ onFileChange, logoPreviewUrl }) {
  const [avatarSrc, setAvatarSrc] = React.useState(logoPreviewUrl);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
        if (onFileChange) {
          onFileChange(file); // Optionally handle file change
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item>
        {/* Upload Section */}
        <ButtonBase
          component="label"
          role={undefined}
          tabIndex={-1}
          aria-label="Upload Logo"
          sx={{
            borderRadius: '10px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: avatarSrc ? 'none' : '2px dashed #ccc', 
            backgroundColor: avatarSrc ? 'transparent' : '#f4f4f4',
            '&:hover': {
              backgroundColor: avatarSrc ? 'transparent' : '#e0e0e0',
            },
            '&:focus-visible': {
              outline: '2px solid #1976d2',
              outlineOffset: '2px',
            },
            position: 'relative',
          }}
        >
          {/* If no logo is uploaded, show the upload icon */}
          {!avatarSrc ? (
            <UploadIcon sx={{ fontSize: 50, color: '#1976d2' }} />
          ) : (
            <Avatar
              alt="Logo preview"
              src={avatarSrc}
              sx={{
                width: 120,
                height: 'auto',
                borderRadius: 5,
                border: '1px solid #ccc',
              }}
            />
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {!avatarSrc ? 'Upload Logo' : 'Change Logo'}
          </Typography>
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            style={{
              border: 0,
              clip: 'rect(0 0 0 0)',
              height: '1px',
              margin: '-1px',
              overflow: 'hidden',
              padding: 0,
              position: 'absolute',
              whiteSpace: 'nowrap',
              width: '1px',
            }}
            onChange={handleAvatarChange}
          />
        </ButtonBase>
      </Grid>

      <Grid item>
        <Typography variant="caption" color="textSecondary">
          {avatarSrc
            ? 'Click to change the logo.'
            : 'Select a logo image to upload.'}
        </Typography>
      </Grid>
    </Grid>
  );
}
