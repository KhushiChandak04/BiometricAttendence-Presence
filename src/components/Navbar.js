import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AccountCircle, Dashboard, Face, CropFree, PersonAdd } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(18, 18, 18, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: theme.palette.mode === 'dark'
    ? '1px solid rgba(81, 81, 81, 0.3)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 30px rgba(0, 0, 0, 0.1)'
    : '0 4px 30px rgba(33, 150, 243, 0.1)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 3),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 10px rgba(255, 0, 128, 0.5)'
    : '0 0 10px rgba(33, 150, 243, 0.5)',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const NavButtons = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '10px',
  padding: theme.spacing(1, 2),
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.dark,
  textTransform: 'none',
  fontSize: '0.9rem',
  backgroundColor: active 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(25, 118, 210, 0.1)'
    : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(25, 118, 210, 0.2)',
  },
}));

const navItems = [
  { path: '/', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/face-recognition', label: 'Face Recognition', icon: <Face /> },
  { path: '/qr-scanner', label: 'QR Scanner', icon: <CropFree /> },
  { path: '/registration', label: 'Registration', icon: <PersonAdd /> },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <LogoText variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none' }}>
          <AccountCircle />
          BiometricPresence
        </LogoText>
        <NavButtons>
          {navItems.map((item) => (
            <StyledButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              active={location.pathname === item.path}
              startIcon={item.icon}
            >
              {item.label}
            </StyledButton>
          ))}
        </NavButtons>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
