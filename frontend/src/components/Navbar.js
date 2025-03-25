import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Face as FaceIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(10, 25, 41, 0.7)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledButton = styled(Button)(({ theme, isactive }) => ({
  margin: theme.spacing(0, 1),
  color: isactive === 'true' ? theme.palette.primary.main : 'inherit',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/face-recognition', label: 'Face Recognition', icon: <FaceIcon /> },
    { path: '/qr-scanner', label: 'QR Scanner', icon: <QrCodeIcon /> },
    { path: '/registration', label: 'Registration', icon: <PersonAddIcon /> },
  ];

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 0,
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          mr: 4
        }}>
          Biometric Attendance
        </Typography>

        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
          {navItems.map((item) => (
            <StyledButton
              key={item.path}
              component={Link}
              to={item.path}
              isactive={isActive(item.path).toString()}
              startIcon={item.icon}
            >
              {item.label}
            </StyledButton>
          ))}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
