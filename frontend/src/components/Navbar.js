import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: theme.spacing(2),
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Biometric Attendance
        </Typography>
        <Button color="inherit" component={RouterLink} to="/" className={classes.link}>
          Dashboard
        </Button>
        <Button color="inherit" component={RouterLink} to="/face-recognition" className={classes.link}>
          Face Recognition
        </Button>
        <Button color="inherit" component={RouterLink} to="/qr-scanner" className={classes.link}>
          QR Scanner
        </Button>
        <Button color="inherit" component={RouterLink} to="/register" className={classes.link}>
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
