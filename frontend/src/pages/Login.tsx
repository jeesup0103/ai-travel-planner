import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = await authService.login(credentialResponse.credential);
      await login(token);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to show an error message to the user
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            AI Travel Planner
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to start planning your next adventure
          </Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;