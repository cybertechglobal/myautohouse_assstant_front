import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogActions, TextField, Button, Grid,
  Autocomplete, Divider, Typography
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DialogHeader from '../common/dialog-header/DialogHeader';
import UploadLogo from '../common/upload-logo/UploadLogo';
import { companySchema } from '../../schemas/company';

import useCustomMutation from '../../hooks/useCustomMutation';
import { createCompany, updateCompany, uploadCompanyLogo } from '../../api/companies';
import { useQueryClient } from '@tanstack/react-query';
import { notifySuccess } from '../../helpers/utils/notify';

function getCleanDefaults(defaultValues) {
  return {
    name: defaultValues.name || '',
    description: defaultValues.description || '',
    country: defaultValues.country || '',
    city: defaultValues.city || '',
    address: defaultValues.address || '',
    postal_code: defaultValues.postal_code || '',
    email: defaultValues.email || '',
    phone: defaultValues.phone === '' ? null : defaultValues.phone || '',
    website: defaultValues.website || '',
    company_group_id: defaultValues.company_group_id ?? null,
    logo: null,
  };
}

export default function AddEditCompanyDialog({
  open,
  editMode,
  onClose,
  defaultValues = {},
  companyGroups = [],
  lockedCompanyGroup = false,
  queryParams
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const queryClient = useQueryClient();

  const { companyGroupId } = queryParams;

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: getCleanDefaults(defaultValues),
    resolver: yupResolver(companySchema),
  });

  const logoFile = watch('logo');

  const createMutation = useCustomMutation({ mutationFn: createCompany });
  const updateMutation = useCustomMutation({ mutationFn: updateCompany });
  const uploadLogoMutation = useCustomMutation({
    mutationFn: ({ companyId, file }) => {
      const formData = new FormData();
      formData.append('logo', file);
      return uploadCompanyLogo(companyId, formData);
    },
  });

  const handleFormSubmit = async (formData) => {
    const { logo, company_group_id, ...rest } = formData;


    const cleanedData = {
      ...Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== '' && v !== undefined)
      ),
      company_group_id: company_group_id || null,
    };


    try {
      let company;

      if (editMode && defaultValues?.id) {
        company = await updateMutation.mutateAsync({
          companyId: defaultValues.id,
          data: cleanedData,
        });
        notifySuccess('Auto House successfully updated');
      } else {
        company = await createMutation.mutateAsync(cleanedData);
        notifySuccess('Auto House successfully added');
      }

      if (logo) {
        const uploaded = await uploadLogoMutation.mutateAsync({
          companyId: company.id,
          file: logo,
        });
        company = { ...company, logo_url: uploaded.url };
      } else if (editMode && defaultValues?.logo_url) {
        company = { ...company, logo_url: defaultValues.logo_url };
      }


      /* queryClient.setQueryData(['companies', queryParams], (old) => {
         console.log(old)
         //if (!old) return { data: [company], total: 1 };
 
         const existingIndex = old.data.findIndex((c) => c.id === company.id);
         let newData;
 
         if (existingIndex !== -1) {
           newData = [...old.data];
           newData[existingIndex] = company;
         } else {
           newData = [company, ...old.data];
         }
 
         return {
           ...old,
           data: newData,
           total: existingIndex !== -1 ? old.total : old.total + 1,
         };
       });*/
      queryClient.invalidateQueries(['companies']);
      reset(getCleanDefaults({}));
      setPreviewUrl(null);
      onClose();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!open) return;
    reset(getCleanDefaults(defaultValues));
    if (editMode && defaultValues.logo_url) {
      setPreviewUrl(defaultValues.logo_url);
    } else {
      setPreviewUrl(null);
    }
  }, [open, editMode, defaultValues, reset]);

  useEffect(() => {
    if (logoFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(logoFile[0]);
    }
  }, [logoFile]);

  const selectedCompanyGroup =
    companyGroups.find((group) => group.id === watch('company_group_id')) || null;

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadLogoMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Auto House' : 'Add Auto House'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                label="Postal Code"
                {...register('postal_code')}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Website"
                {...register('website')}
                error={!!errors.website}
                helperText={errors.website?.message}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Autocomplete
                size="small"
                disabled={lockedCompanyGroup}
                options={companyGroups}
                getOptionLabel={(option) => option.name}
                value={selectedCompanyGroup}
                onChange={(_, newValue) =>
                  setValue('company_group_id', newValue?.id || '')
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Company Group"
                    error={!!errors.company_group_id}
                    helperText={errors.company_group_id?.message}
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                size="small"
                label="Description"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <UploadLogo
                logoPreviewUrl={previewUrl}
                onFileChange={(file) => setValue('logo', file)}
              />
            </Grid>
          </Grid>

          {isSaving && (
            <Typography
              variant="body2"
              sx={{ mt: 2, color: 'text.secondary' }}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving company...'
                : uploadLogoMutation.isPending
                  ? 'Uploading logo...'
                  : ''}
            </Typography>
          )}

          <Divider sx={{ mt: 4, mb: 2 }} />
          <DialogActions>
            <Button onClick={onClose} variant="outlined" color='inherit' disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
