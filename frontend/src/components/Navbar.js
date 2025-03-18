import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles, useTheme } from '@material-ui/core';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AccountCircle, Dashboard, Face, QrCode2, PersonAdd } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: theme.palette.type === 'dark'
      ? 'rgba(18, 18, 18, 0.8)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: theme.palette.type === 'dark'
      ? '1px solid rgba(81, 81, 81, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: theme.palette.type === 'dark'
      ? '0 4px 30px rgba(0, 0, 0, 0.1)'
      : '0 4px 30px rgba(33, 150, 243, 0.1)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 3),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(255, 0, 128, 0.5)'
      : '0 0 10px rgba(33, 150, 243, 0.5)',
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
  navButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  button: {
    borderRadius: '10px',
    padding: theme.spacing(1, 2),
    color: theme.palette.type === 'dark' ? '#fff' : theme.palette.primary.dark,
    textTransform: 'none',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.6s ease',
    },
    '&:hover': {
      background: theme.palette.type === 'dark'
        ? 'rgba(255, 0, 128, 0.1)'
        : 'rgba(33, 150, 243, 0.1)',
      '&::before': {
        transform: 'translateX(100%)',
      },
    },
    '&.active': {
      background: theme.palette.type === 'dark'
        ? 'rgba(255, 0, 128, 0.2)'
        : 'rgba(33, 150, 243, 0.2)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 0 10px rgba(255, 0, 128, 0.3)'
        : '0 0 10px rgba(33, 150, 243, 0.3)',
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          <AccountCircle />
          Biometric Attendance
        </Typography>
        <div className={classes.navButtons}>
          <Button
            component={RouterLink}
            to="/"
            className={`${classes.button} ${isActive('/') ? 'active' : ''}`}
          >
            <Dashboard className={classes.icon} />
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/face-recognition"
            className={`${classes.button} ${isActive('/face-recognition') ? 'active' : ''}`}
          >
            <Face className={classes.icon} />
            Face Recognition
          </Button>
          <Button
            component={RouterLink}
            to="/qr-scanner"
            className={`${classes.button} ${isActive('/qr-scanner') ? 'active' : ''}`}
          >
            <QrCode2 className={classes.icon} />
            QR Scanner
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            className={`${classes.button} ${isActive('/register') ? 'active' : ''}`}
          >
            <PersonAdd className={classes.icon} />
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
