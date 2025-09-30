import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Divider,
  MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { voiceSchema } from '../../schemas/voice';
import DialogHeader from '../common/dialog-header/DialogHeader';

export default function AddEditVoiceModal({
  open,
  editMode,
  onClose,
  onSubmit,
  isSaving,
  defaultValues = {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(voiceSchema),
  });

  const emptyValues = {
    name: '',
    language: '',
    gender: '',
    pitch: 0,
    speaking_rate: 1,
    provider: ''
  };

  React.useEffect(() => {
    if (open) {
      reset(editMode ? defaultValues : emptyValues);
    }
  }, [open, defaultValues, editMode, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Voice' : 'Add Voice'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              size='small'
            />
            <TextField
              label="Language"
              {...register('language')}
              error={!!errors.language}
              helperText={errors.language?.message}
              size='small'
            />
            <TextField
              select
              label="Gender"
              {...register('gender')}
              error={!!errors.gender}
              helperText={errors.gender?.message}
              size='small'
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
            <TextField
              label="Pitch"
              type="number"
              {...register('pitch', { valueAsNumber: true })}
              error={!!errors.pitch}
              helperText={errors.pitch?.message}
              size='small'
            />
            <TextField
              label="Speaking Rate"
              type="number"
              {...register('speaking_rate', { valueAsNumber: true })}
              error={!!errors.speaking_rate}
              helperText={errors.speaking_rate?.message}
              size='small'
            />
            <TextField
              label="Provider"
              {...register('provider')}
              error={!!errors.provider}
              helperText={errors.provider?.message}
              size='small'
            />
          </Stack>
          <Divider sx={{ mt: 2 }} />
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} color='text' variant='outlined'>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
