import { useEffect, useState } from 'react';
import {
  Dialog,
  Divider,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Grid,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getUserSchema } from '../../schemas/user';

import DialogHeader from '../common/dialog-header/DialogHeader';

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

export default function AddEditAdminDialog({
  open,
  onClose,
  onSubmit,
  formData,
  editMode,
  isLoading,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(getUserSchema(editMode)),
    defaultValues,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    reset(
      editMode && formData
        ? {
          ...defaultValues,
          first_name: formData.first_name || '',
          last_name: formData.last_name || '',
          email: formData.email || '',
        }
        : defaultValues
    );
  }, [formData, editMode, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title={editMode ? 'Edit Admin' : 'Add New Admin'} onClose={onClose} />
      <DialogContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={2} mt={1}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  size="small"
                  label="First Name"
                  {...register('first_name')}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  size="small"
                  label="Last Name"
                  {...register('last_name')}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <TextField
              size="small"
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              required
              type="email"
            />

            {!editMode && (
              <>
                <TextField
                  size="small"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  size="small"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirm_password')}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  fullWidth
                  required
                />
              </>
            )}
          </Stack>
        </form>
        <Divider sx={{ mt: 4, mb: 2 }} />
        <DialogActions >
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={editMode ? <SaveIcon /> : <AddIcon />}
            onClick={handleSubmit(onFormSubmit)}
            disabled={isLoading}
          >
            {isLoading
              ? editMode
                ? 'Updating...'
                : 'Adding...'
              : editMode
                ? 'Update Admin'
                : 'Add Admin'}
          </Button>
        </DialogActions>
      </DialogContent>

    </Dialog>
  );
}
