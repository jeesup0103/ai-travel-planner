import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Start Chat',
      description: 'Chat with our AI to get personalized travel recommendations',
      image: '/images/chat.jpg',
      path: '/chat',
    },
    {
      title: 'Profile Settings',
      description: 'Update your travel preferences and profile information',
      image: '/images/profile.jpg',
      path: '/profile',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" component="p">
        Ready to plan your next adventure? Start by chatting with our AI travel planner
        or update your preferences to get personalized recommendations.
      </Typography>

      <Stack spacing={3} sx={{ mt: 3 }} direction={{ xs: 'column', sm: 'row' }}>
        {features.map((feature) => (
          <Box key={feature.title} sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Card>
              <CardActionArea onClick={() => navigate(feature.path)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Home;