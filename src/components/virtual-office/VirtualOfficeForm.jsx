import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Divider,
  Typography,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import UploadIcon from '@mui/icons-material/Upload';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createVirtualOffice,
  updateVirtualOffice,
  uploadVirtualOfficeBackground,
  uploadVirtualOfficeAvatar,
  deleteVirtualOfficeAvatar
} from '../../api/virtualOffices';

import DeleteIcon from '@mui/icons-material/Delete';

import { yupResolver } from '@hookform/resolvers/yup';
import { virtualOfficeSchema } from '../../schemas/virtualOffice';

import { notifySuccess } from '../../helpers/utils/notify';
import DialogHeader from '../common/dialog-header/DialogHeader';

import { useAuthStore } from '../../store/authStore';

export default function VirtualOfficeForm({ open, onClose, companyId, office }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(virtualOfficeSchema),
    defaultValues: {
      name: '',
      type: '',
      configuration: {
        x: '',
        y: '',
        width: '',
        height: '',
      },
    },
  });

  const [background, setBackground] = useState(null);
  const isEdit = Boolean(office);
  const [previewImage, setPreviewImage] = useState(null);
  const queryClient = useQueryClient();

  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const backgroundUploadMutation = useMutation({
    mutationFn: ({ companyId, virtualOfficeId, file }) =>
      uploadVirtualOfficeBackground({ companyId, virtualOfficeId, file }),
    onError: (error) => {
      console.error('Background upload failed:', error);
    },
  });

  const avatarUploadMutation = useMutation({
    mutationFn: ({ companyId, virtualOfficeId, file }) =>
      uploadVirtualOfficeAvatar({ companyId, virtualOfficeId, file }),
    onError: (error) => {
      console.error('Avatar upload failed:', error);
    },
  });

  const mutation = useMutation({
    mutationFn: ({ companyId, data, id }) =>
      id
        ? updateVirtualOffice({ companyId, virtualOfficeId: id, data })
        : createVirtualOffice({ companyId, data }),
    onSuccess: async (result, variables) => {
      const virtualOfficeId = isEdit ? office.id : result.id;

      let uploadedBackgroundUrl = null;
      let uploadedAvatarUrl = null;

      // Upload background
      if (background && typeof background !== 'string') {
        try {
          const uploadResult = await backgroundUploadMutation.mutateAsync({
            companyId,
            virtualOfficeId,
            file: background,
          });
          uploadedBackgroundUrl = uploadResult?.background.url || null;
          if (uploadedBackgroundUrl) setPreviewImage(uploadedBackgroundUrl);
        } catch (error) {
          console.error('Background upload failed', error);
        }
      }

      // Upload avatar
      if (avatar && typeof avatar !== 'string') {
        try {
          const uploadResult = await avatarUploadMutation.mutateAsync({
            companyId,
            virtualOfficeId,
            file: avatar,
          });
          uploadedAvatarUrl = uploadResult?.avatar.url || null;
          if (uploadedAvatarUrl) setPreviewAvatar(uploadedAvatarUrl);
        } catch (error) {
          console.error('Avatar upload failed', error);
        }
      }

      // Update cache
      queryClient.setQueryData(['virtualOffices', companyId], (oldData) => {
        if (!oldData) return [];

        const updatedItem = {
          ...(isEdit ? variables.data : result),
          ...(uploadedBackgroundUrl && { background_url: uploadedBackgroundUrl }),
          ...(uploadedAvatarUrl && { file_generation_in_progress: true }),
        };

        if (isEdit) {
          return oldData.map((item) =>
            item.id === virtualOfficeId ? { ...item, ...updatedItem } : item
          );
        }

        return [...oldData, updatedItem];

      });
      queryClient.invalidateQueries(['virtualOffices', companyId]);
      notifySuccess(isEdit ? 'Virtual office updated' : 'Virtual office created');
      onClose();
    }

  });

  useEffect(() => {
    if (office) {
      reset({
        name: office?.name || '',
        type: office?.type || '',
        configuration: office?.configuration || {
          x: '',
          y: '',
          width: '',
          height: '',
        },
      });

      setPreviewImage(office.background_url || null);
      if (office.files && office.files.length > 0) {
        const bgFile = office.files.find(file => file.url);
        if (bgFile) {
          setPreviewAvatar(bgFile.url);
        } else {
          setPreviewAvatar(office.background_url || null);
        }
      }

    } else {
      reset({
        name: '',
        type: '',
        configuration: {
          x: '',
          y: '',
          width: '',
          height: '',
        },
      });
      setPreviewImage(null);
      setBackground(null);
      setPreviewAvatar(null);
      setAvatar(null);
    }
  }, [office, reset, open]);

  const onSubmit = (data) => {
    const parsedConfig = data.configuration;

    mutation.mutate({
      companyId,
      ...(office?.id && { id: office.id }),
      data: {
        ...data,
        configuration: parsedConfig,
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackground(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteAvatarMutation = useMutation({
    mutationFn: ({ companyId, virtualOfficeId }) =>
      deleteVirtualOfficeAvatar({ companyId, virtualOfficeId }),
    onSuccess: () => {
      setPreviewAvatar(null);
      setAvatar(null);
      queryClient.invalidateQueries(['virtualOffices', companyId]);
      notifySuccess('Avatar removed');
    },
    onError: (error) => {
      console.error('Avatar deletion failed:', error);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEdit ? 'Edit Virtual Office' : 'Add Virtual Office'} onClose={onClose} />

        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              fullWidth
              size="small"
              label="Office Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{
                borderRadius: 2,
              }}
            />
            {!isAdmin && (
              <>
                <FormControl fullWidth size="small" margin="normal">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    label="Type"
                    value={watch('type') || ''}
                    {...register('type')}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="service">Service</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="subtitle2" align="center">TV Configuration</Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <TextField
                    label="X"
                    type="number"
                    size="small"
                    {...register('configuration.x', { valueAsNumber: true })}
                    error={!!errors.configuration?.x}
                    helperText={errors.configuration?.x?.message}
                  />
                  <TextField
                    label="Y"
                    type="number"
                    size="small"
                    {...register('configuration.y', { valueAsNumber: true })}
                    error={!!errors.configuration?.y}
                    helperText={errors.configuration?.y?.message}
                  />
                </Stack>
                <Stack direction="row" spacing={2} mt={1} justifyContent="center">
                  <TextField
                    label="Width"
                    type="number"
                    size="small"
                    {...register('configuration.width', { valueAsNumber: true })}
                    error={!!errors.configuration?.width}
                    helperText={errors.configuration?.width?.message}
                  />
                  <TextField
                    label="Height"
                    type="number"
                    size="small"
                    {...register('configuration.height', { valueAsNumber: true })}
                    error={!!errors.configuration?.height}
                    helperText={errors.configuration?.height?.message}
                  />
                </Stack></>)}

            <Box textAlign="center">
              {!isAdmin && <label htmlFor="background-upload">
                <input
                  type="file"
                  accept="image/*"
                  id="background-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button variant="outlined" color='inherit' component="span" sx={{ textTransform: 'none' }}>
                  <UploadIcon sx={{ mr: 1 }} />
                  {background ? 'Change Background' : 'Upload Background'}
                </Button>
              </label>}

              {previewImage && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {background ? 'Selected Background' : 'Current Background'}
                  </Typography>
                  <Box
                    component="img"
                    src={previewImage}
                    alt="Background Preview"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mt: 1,
                    }}
                  />
                </Box>
              )}

              {/* If a file is selected, show its name */}
              {background && (
                <Box mt={1} fontSize={14}>
                  Selected: {background.name}
                </Box>
              )}
            </Box>

            <Box textAlign="center" mt={3}>
              <label htmlFor="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <Button variant="outlined" color='inherit' component="span" sx={{ textTransform: 'none' }}>
                  <UploadIcon sx={{ mr: 1 }} />
                  {avatar ? 'Change Avatar' : 'Upload Avatar'}
                </Button>
              </label>

              {previewAvatar && (
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {avatar ? 'Selected Avatar' : 'Current Avatar'}
                  </Typography>
                  <Box
                    component="img"
                    src={previewAvatar}
                    alt="Avatar Preview"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mt: 1,
                    }}
                  />
                </Box>
              )}
              {previewAvatar && isEdit && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    if (office?.id) {
                      deleteAvatarMutation.mutate({ companyId, virtualOfficeId: office.id });
                    }
                  }}
                  startIcon={<DeleteIcon />}
                >
                  Remove Avatar
                </Button>
              )}
              {avatar && (
                <Box mt={1} fontSize={14}>
                  Selected: {avatar.name}
                </Box>
              )}
            </Box>
          </Stack>
          <Divider sx={{ mt: 4, mb: 2 }} />

          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="text.secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isLoading || backgroundUploadMutation.isLoading}
            >
              {mutation.isLoading || backgroundUploadMutation.isLoading
                ? isEdit ? 'Updating...' : 'Creating...'
                : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </DialogContent>


      </form>
    </Dialog >
  );
}
