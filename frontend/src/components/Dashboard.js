import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  makeStyles,
  Card,
  CardContent,
  Button
} from '@material-ui/core';
import { 
  Face as FaceIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  LocationOn as LocationIcon 
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();

  const features = [
    {
      title: 'Face Recognition',
      description: 'Mark attendance using facial recognition',
      icon: <FaceIcon className={classes.icon} color="primary" />,
      path: '/face-recognition',
    },
    {
      title: 'QR Code Scanner',
      description: 'Scan QR code for quick attendance',
      icon: <QrCodeIcon className={classes.icon} color="primary" />,
      path: '/qr-scanner',
    },
    {
      title: 'Register New User',
      description: 'Add new employees to the system',
      icon: <PersonAddIcon className={classes.icon} color="primary" />,
      path: '/register',
    },
    {
      title: 'Location Tracking',
      description: 'GPS-based attendance verification',
      icon: <LocationIcon className={classes.icon} color="primary" />,
      path: '/face-recognition',
    },
  ];

  return (
    <Container className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Welcome to Biometric Attendance System
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Select a feature to get started
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                className={classes.card}
                onClick={() => history.push(feature.path)}
              >
                <CardContent className={classes.cardContent}>
                  {feature.icon}
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => history.push(feature.path)}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
