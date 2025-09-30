import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import useCustomMutation from '../../hooks/useCustomMutation';
import {
  createDataCollection,
  updateDataCollection,
} from '../../api/dataCollections';
import { notifySuccess } from '../../helpers/utils/notify';
import { dataCollectionsSchema } from '../../schemas/dataCollections';
import DialogHeader from '../common/dialog-header/DialogHeader';


function getCleanDefaults(defaultValues) {
  return {
    name: defaultValues.name || '',
    tags: defaultValues.tags || [],
    type: defaultValues.type || 'api',
    url: defaultValues.url || '',
    method: defaultValues.method || '',
    headers: defaultValues.headers || [{ key: '', value: '' }],
    payloadProperty: defaultValues.payloadProperty || '',
    file: defaultValues.file || '',
  };
}

export default function AddEditDataCollectionDialog({
  open,
  onClose,
  defaultValues = {},
  companyId,
}) {
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: getCleanDefaults(defaultValues),
    resolver: yupResolver(dataCollectionsSchema),
  });

  const tags = watch('tags');
  const [tagInput, setTagInput] = React.useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      reset(getCleanDefaults(defaultValues));
      setTagInput('');
    }
  }, [open, defaultValues, reset]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().replace(/,$/, '');
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue('tags', [...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove));
  };

  const createMutation = useCustomMutation({
    mutationFn: ({ data }) => createDataCollection(companyId, data),
    onSuccess: () => {
      notifySuccess('Data Collection created');
      queryClient.invalidateQueries(['dataCollections', companyId]);
      onClose();
    },
  });

  const editMutation = useCustomMutation({
    mutationFn: ({ data }) => updateDataCollection(companyId, defaultValues.id, data),
    onSuccess: () => {
      notifySuccess('Data Collection updated');
      queryClient.invalidateQueries(['dataCollections', companyId]);
      onClose();
    },
  });

  const handleFormSubmit = (formData) => {
    const data = {
      name: formData.name,
      tags: formData.tags,
    };

    if (defaultValues.id) {
      editMutation.mutate({ data });
    } else {
      createMutation.mutate({ data });
    }
  };

  const isSubmitting = createMutation.isPending || editMutation.isPending;
  const isProcessing = isSubmitting;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={defaultValues.id ? 'Edit Data Collection' : 'Add Data Collection'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            label="Name"
            {...register('name')}
            fullWidth
            margin="normal"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Box mt={2}>
            <TextField
              label="Add Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
              size="small"
              helperText="Use enter or comma to add a tag"
            />
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ my: 2 }}/>
          <DialogActions>
            <Button variant="outlined" color='text' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
