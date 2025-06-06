import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{borderBottom:"1px solid #efefef"}}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              mr: 4,
              cursor: 'pointer',
              fontSize: '2rem',
              fontWeight: 600,
            }}
            onClick={() => navigate('/')}
          >
            Travel Planner
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto', alignItems: 'center'}}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              Home
            </Button>
            {user && (
              <Button
                color="inherit"
                aria-label="account of current user"
                onClick={() => navigate('/chat')}
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                Chat
              </Button>
            )}
          </Box>
          {user ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt={user.name} src={user.picture} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;