import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [newPreference, setNewPreference] = useState('');
  const [preferences, setPreferences] = useState(user?.travelPreferences || []);

  const handleAddPreference = () => {
    if (!newPreference.trim()) return;

    const updatedPreferences = [...preferences, newPreference.trim()];
    setPreferences(updatedPreferences);
    setNewPreference('');

    // Update user preferences in the backend
    handleSavePreferences(updatedPreferences);
  };

  const handleRemovePreference = (preferenceToRemove: string) => {
    const updatedPreferences = preferences.filter(
      (preference: string) => preference !== preferenceToRemove
    );
    setPreferences(updatedPreferences);

    // Update user preferences in the backend
    handleSavePreferences(updatedPreferences);
  };

  const handleSavePreferences = async (updatedPreferences: string[]) => {
    try {
      const updatedUser = await authService.updateUserPreference({
        travelPreferences: updatedPreferences,
      });
      updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="textSecondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Travel Preferences
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {preferences.map((preference: string) => (
              <Chip
                key={preference}
                label={preference}
                onDelete={() => handleRemovePreference(preference)}
              />
            ))}
          </Stack>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              placeholder="Add travel preference (e.g., 'Museums', 'Nature')"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPreference();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddPreference}
              disabled={!newPreference.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Your travel preferences help us provide better recommendations
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;