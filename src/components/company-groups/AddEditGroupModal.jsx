import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { companyGroupSchema } from '../../schemas/companyGroup';
import UploadLogo from '../common/upload-logo/UploadLogo';

const emptyValues = {
  name: '',
  description: '',
  country: '',
  city: '',
  address: '',
  postalCode: '',
  contact_email: '',
  contact_phone: '',
  logo: null,
};

export default function AddEditGroupModal({
  open,
  editMode,
  onClose,
  onSubmit,
  isSaving,
  defaultValues = {},
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: emptyValues,
    resolver: yupResolver(companyGroupSchema),
  });

  const logoFile = watch('logo');

  useEffect(() => {
    if (logoFile?.[0]) {
      const file = logoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  }, [logoFile]);

  useEffect(() => {
    if (!open) return;

    reset(editMode ? { ...defaultValues, logo: null } : emptyValues);

    if (editMode && defaultValues.logo_url) {
      setPreviewUrl(defaultValues.logo_url);
    } else {
      setPreviewUrl(null);
    }
  }, [open, editMode, defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
        {editMode ? 'Edit Auto House Group' : 'Add Auto House Group'}
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
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Contact Email"
                {...register('contact_email')}
                error={!!errors.contact_email}
                helperText={errors.contact_email?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Contact Phone"
                {...register('contact_phone')}
                error={!!errors.contact_phone}
                helperText={errors.contact_phone?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Country"
                {...register('country')}
                error={!!errors.country}
                helperText={errors.country?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="City"
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Address"
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Postal Code"
                {...register('postalCode')}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                multiline
                rows={3}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <UploadLogo
                logoPreviewUrl={previewUrl}
                onFileChange={(file) => setValue('logo', file)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 4, mb: 2 }} />

          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="text-secondary">Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
