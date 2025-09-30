import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import useCustomMutation from '../hooks/useCustomMutation';

import Logo from '../assets/logo.png';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: login,
    onSuccess: (user) => {
      if (!user) return;
      switch (user.role) {
        case 'root':
          navigate('/company-groups');
          break;
        case 'group_admin':
          navigate('/companies');
          break;
        case 'admin':
          navigate('/assistants');
          break;
        default:
          navigate('/login');
          break;
      }
    },
  });

  const onSubmit = (data) => {
    mutate({ ...data, rememberMe });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        background: 'transparent',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 350,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >

       <img src={Logo} width={300} style={{ marginBottom: '20px' }} alt="Logo MyAutoHouse" />

        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            size='small'
            {...register('email', { required: true })}
            margin="normal"
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            size='small'
            {...register('password', { required: true })}
            margin="normal"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember me"
            sx={{ mt: 2, }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
