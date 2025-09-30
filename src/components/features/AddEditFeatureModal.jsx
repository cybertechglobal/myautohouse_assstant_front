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
import { featureSchema } from '../../schemas/feature';
import { useQueryClient } from '@tanstack/react-query';
import useCustomMutation from '../../hooks/useCustomMutation';
import { createFeature, updateFeature } from '../../api/features';
import { notifySuccess } from '../../helpers/utils/notify';
import DialogHeader from '../common/dialog-header/DialogHeader';


export default function AddEditFeatureModal({
  open,
  onClose,
  editMode,
  defaultValues,
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(featureSchema),
    defaultValues: defaultValues || {},
  });

  const createMutation = useCustomMutation({
    mutationFn: createFeature,
    onMutate: (variables) => {
      const previousFeatures = queryClient.getQueryData(['features']);

      // Ensure oldData is an array
      const featuresData = Array.isArray(previousFeatures) ? previousFeatures : [];

      queryClient.setQueryData(['features'], [...featuresData, variables]);

      return { previousFeatures };
    },
    onSuccess: () => {
      notifySuccess('Feature created successfully!');
      onClose();
    },
  });

  // Update feature mutation
  const updateMutation = useCustomMutation({
    mutationFn: updateFeature,
    onMutate: (variables) => {
      const previousFeatures = queryClient.getQueryData(['features']);

      // Check if previousFeatures is an array, then update the relevant feature
      const updatedFeatures = previousFeatures.map((feature) =>
        feature.id === variables.featureId ? { ...feature, ...variables.data } : feature
      );

      // Optimistically update the features array
      queryClient.setQueryData(['features'], updatedFeatures);

      return { previousFeatures };
    },
    onError: (err, variables, context) => {
      // Revert to previous state on error
      queryClient.setQueryData(['features'], context.previousFeatures);
    },
    onSuccess: () => {
      notifySuccess('Feature updated successfully!');
      onClose();
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data) => {
    const cleanedData = {
      name: data.name,
      description: data.description || undefined
    }

    let featureData;
    try {
      if (editMode) {
        featureData = await updateMutation.mutateAsync({
          featureId: defaultValues.id,
          data: cleanedData,
        });
      } else {
        featureData = await createMutation.mutateAsync(cleanedData);
      }
    } catch (error) {
      console.error('Error submitting feature data:', error);
    }
  };

  React.useEffect(() => {
    if (open && defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Feature' : 'Add Feature'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Feature Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
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
