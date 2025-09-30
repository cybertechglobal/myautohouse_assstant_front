import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  Divider
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { packageSchema } from '../../schemas/package';
import { useQueryClient } from '@tanstack/react-query';
import useCustomMutation from '../../hooks/useCustomMutation';
import { createPackage, updatePackage } from '../../api/packages';
import { notifySuccess } from '../../helpers/utils/notify';
import DialogHeader from '../common/dialog-header/DialogHeader';


export default function AddEditPackageModal({
  open,
  onClose,
  editMode,
  defaultValues,
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(packageSchema),
    defaultValues: defaultValues || {},
  });

  const createMutation = useCustomMutation({
    mutationFn: createPackage,
    onMutate: (variables) => {
      const previousPackages = queryClient.getQueryData(['packages']);
      queryClient.setQueryData(['packages'], (oldData) => ({
        ...oldData,
        data: [...oldData.data, variables],
      }));

      return { previousPackages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['packages'], context.previousPackages);
    },
    onSuccess: () => {
      notifySuccess('Package created successfully!');
      onClose();
    },
  });

  const updateMutation = useCustomMutation({
    mutationFn: updatePackage,
    onMutate: (variables) => {
      const previousPackages = queryClient.getQueryData(['packages']);
      const updatedPackages = previousPackages.data.map((pkg) =>
        pkg.id === variables.packageId ? { ...pkg, ...variables.data } : pkg
      );

      queryClient.setQueryData(['packages'], (oldData) => ({
        ...oldData,
        data: updatedPackages,
      }));

      return { previousPackages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['packages'], context.previousPackages);
    },
    onSuccess: () => {
      notifySuccess('Package updated successfully!');
      onClose();
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data) => {
    const cleanedData = {
      name: data.name,
      price: data.price,
      conversations_limit: data.conversations_limit
    }

    let packageData;
    try {
      if (editMode) {
        packageData = await updateMutation.mutateAsync({
          packageId: defaultValues.id,
          data: cleanedData,
        });
      } else {
        packageData = await createMutation.mutateAsync(cleanedData);
      }
    } catch (error) {
      console.error('Error submitting package data:', error);
    }
  };

  React.useEffect(() => {
    if (open) {
      if (editMode) {
        reset(defaultValues);
      } else {
        reset({
          name: '',
          price: '',
          conversations_limit: '',
        });
      }
    }
  }, [open, defaultValues, reset, editMode]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Package' : 'Add Package'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Package Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              size="small"
            />
            <TextField
              label="Price"
              type="number"
              {...register('price', { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
              size="small"
            />
            <TextField
              label="Conversations Limit"
              type="number"
              {...register('conversations_limit', { valueAsNumber: true })}
              error={!!errors.conversations_limit}
              helperText={errors.conversations_limit?.message}
              fullWidth
              size="small"
            />
          </Stack>
          <Divider sx={{ mt: 2 }} />
          <DialogActions>
            <Button color='text' variant='outlined' onClick={onClose} disabled={isSaving}>
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
