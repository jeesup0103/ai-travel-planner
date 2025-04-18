import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Travel Planning',
      description: 'Get personalized travel recommendations using advanced AI technology',
      image: '/images/chat.jpg',
      requiresAuth: true,
      action: () => navigate('/chat'),
    },
    {
      title: 'Interactive Maps',
      description: 'Visualize your travel destinations with integrated Google Maps',
      image: '/images/maps.jpg',
      requiresAuth: true,
      action: () => navigate('/chat'),
    },
    {
      title: 'Smart Recommendations',
      description: 'Receive tailored suggestions based on your preferences and interests',
      image: '/images/recommendations.jpg',
      requiresAuth: true,
      action: () => navigate('/profile'),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Plan Your Next Adventure
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Let AI help you create the perfect travel itinerary
        </Typography>
        {!user && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        )}
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardActionArea
              onClick={feature.requiresAuth && !user ? () => navigate('/login') : feature.action}
            >
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
                {feature.requiresAuth && !user && (
                  <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                    Login to access this feature
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;