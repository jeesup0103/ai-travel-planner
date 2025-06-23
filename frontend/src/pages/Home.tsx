import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Travel Recommendation',
      description: 'Get personalized travel recommendations using advanced AI technology',
      image: '/images/chat.jpg',
      requiresAuth: false
    },
    {
      title: 'Interactive Maps',
      description: 'Visualize your travel destinations with integrated Google Maps',
      image: '/images/maps.jpg',
      requiresAuth: false
    },
    {
      title: 'Chat-based interface',
      description: 'Chat your way to personalized place suggestions',
      image: '/images/recommendations.jpg',
      requiresAuth: false
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6, mt: 20}}>
        <Typography variant="h3" gutterBottom marginBottom={10}>
          Plan Your Next Adventure
        </Typography>
        <Typography variant="h6" color="text.secondary" marginBottom={6}>
          Get Personalized travel spot recommendations powered by ChatGPT and Google Maps
        </Typography>
        {!user && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mt: 2, mb: 15 }}
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
        gap: 8,
        mt:20,
        ml:10,
        mr:10,
        mb:20
      }}>
        {features.map((feature) => (
          <Card key={feature.title} sx={{ borderRadius: 10, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="180"
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
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;