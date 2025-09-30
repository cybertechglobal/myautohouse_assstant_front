import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Divider, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { companyFeatureSchema } from '../../../schemas/feature';
import DialogHeader from '../../common/dialog-header/DialogHeader';
import { getFeatures } from '../../../api/features';
import { updateCompanyFeature } from '../../../api/companies';
import useCustomMutation from '../../../hooks/useCustomMutation';
import useCustomQuery from '../../../hooks/useCustomQuery';
import { useQueryClient } from '@tanstack/react-query';
import { notifySuccess } from '../../../helpers/utils/notify';

export default function AddEditFeatureDialog({ open, onClose, formData, editMode, isLoading, companyId }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(companyFeatureSchema),
    defaultValues: formData || {},
  });

  const queryClient = useQueryClient();

  const { data: availableFeatures = [], isLoading: loadingFeatures } = useCustomQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
  });

  const billingType = watch('billing_type');

  useEffect(() => {
    if (editMode && formData?.feature_id) {
      setValue('feature_id', formData.feature_id);
      setValue('price', formData.price);
      setValue('billing_type', formData.billing_type);
      setValue('prepaid_amount', formData.prepaid_amount);
    }
  }, [editMode, formData, setValue]);

  const updateFeatureMutation = useCustomMutation({
    mutationFn: updateCompanyFeature,
    onSuccess: () => {
      queryClient.invalidateQueries(['features-price', companyId]);
      notifySuccess('Feature successfully updated.');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating feature:', error);
    },
  });

  const handleFormSubmit = (data) => {
    const { feature_id, price, billing_type, prepaid_amount } = data;

    const formData = {
      feature_id,
      price,
      billing_type,
      prepaid_amount,
    };

    updateFeatureMutation.mutate({ companyId, data: formData });
  };

  useEffect(() => {
    reset(formData || {});
  }, [formData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Feature' : 'Add New Feature'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Feature</InputLabel>
              <Select
                {...register('feature_id')}
                label="Feature"
                error={!!errors.feature_id}
                value={watch('feature_id') || ""}
                onChange={(e) => setValue('feature_id', e.target.value)}
              >
                {loadingFeatures ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  availableFeatures?.map((feature) => (
                    <MenuItem key={feature.id} value={feature.id}>
                      {feature.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
              size="small"
              required
            />

            {/* Billing Type */}
            <FormControl fullWidth size="small" required>
              <InputLabel>Billing Type</InputLabel>
              <Select
                {...register('billing_type')}
                label="Billing Type"
                error={!!errors.billing_type}
                value={watch('billing_type') || ""}
                onChange={(e) => setValue('billing_type', e.target.value)}
              >
                <MenuItem value="prepaid">Prepaid</MenuItem>
                <MenuItem value="postpaid">Postpaid</MenuItem>
              </Select>
            </FormControl>

            {/* Prepaid Amount - Show this field only when "Prepaid" is selected */}
            {billingType === 'prepaid' && (
              <TextField
                label="Prepaid Amount"
                type="number"
                {...register('prepaid_amount')}
                error={!!errors.prepaid_amount}
                helperText={errors.prepaid_amount?.message}
                fullWidth
                size="small"
              />
            )}
          </Stack>
          <Divider sx={{ mt: 2 }} />
          <DialogActions>
            <Button color="text" variant="outlined" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Saving...' : editMode ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
