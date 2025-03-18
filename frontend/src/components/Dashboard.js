import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  makeStyles,
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Zoom,
  CircularProgress
} from '@material-ui/core';
import { 
  Face as FaceIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  LocationOn as LocationIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 'calc(100vh - 64px)',
    padding: theme.spacing(4),
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(45deg, #000428 30%, #004e92 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: theme.palette.type === 'dark'
      ? 'rgba(18, 18, 18, 0.8)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark'
      ? '1px solid rgba(81, 81, 81, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
  },
  welcomeTitle: {
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(255, 0, 128, 0.5)'
      : '0 0 10px rgba(33, 150, 243, 0.5)',
  },
  subtitle: {
    color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    marginBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    background: theme.palette.type === 'dark'
      ? 'rgba(18, 18, 18, 0.6)'
      : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark'
      ? '1px solid rgba(81, 81, 81, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 8px 30px rgba(255, 0, 128, 0.2)'
        : '0 8px 30px rgba(33, 150, 243, 0.2)',
    },
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
    filter: theme.palette.type === 'dark'
      ? 'drop-shadow(0 0 8px rgba(255, 0, 128, 0.5))'
      : 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))',
  },
  featureTitle: {
    color: theme.palette.type === 'dark' ? '#fff' : theme.palette.primary.dark,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  description: {
    color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    marginBottom: theme.spacing(2),
  },
  button: {
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(45deg, #FF0080 30%, #FF8C00 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: '#fff',
    padding: theme.spacing(1, 3),
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 500,
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.palette.type === 'dark'
        ? 'linear-gradient(45deg, #FF8C00 30%, #FF0080 90%)'
        : 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
      transform: 'scale(1.05)',
    },
  },
  quickActions: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  actionButton: {
    background: theme.palette.type === 'dark'
      ? 'rgba(18, 18, 18, 0.8)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark'
      ? '1px solid rgba(81, 81, 81, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    color: theme.palette.type === 'dark' ? '#fff' : theme.palette.primary.dark,
    '&:hover': {
      background: theme.palette.type === 'dark'
        ? 'rgba(255, 0, 128, 0.2)'
        : 'rgba(33, 150, 243, 0.2)',
    },
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(255, 0, 128, 0.5)'
      : '0 0 10px rgba(33, 150, 243, 0.5)',
  },
  statLabel: {
    color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    fontSize: '0.875rem',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const stats = [
    { value: '157', label: 'Total Employees' },
    { value: '89%', label: 'Attendance Rate' },
    { value: '45', label: 'Present Today' },
  ];

  const features = [
    {
      title: 'Face Recognition',
      description: 'Mark attendance using AI-powered facial recognition',
      icon: <FaceIcon className={classes.icon} />,
      path: '/face-recognition',
    },
    {
      title: 'QR Code Scanner',
      description: 'Quick and secure QR-based attendance',
      icon: <QrCodeIcon className={classes.icon} />,
      path: '/qr-scanner',
    },
    {
      title: 'Register Employee',
      description: 'Add new employees with biometric data',
      icon: <PersonAddIcon className={classes.icon} />,
      path: '/register',
    },
    {
      title: 'Location Tracking',
      description: 'GPS-verified attendance system',
      icon: <LocationIcon className={classes.icon} />,
      path: '/face-recognition',
    },
    {
      title: 'Analytics',
      description: 'Detailed attendance reports and insights',
      icon: <TimelineIcon className={classes.icon} />,
      path: '/analytics',
    },
    {
      title: 'Team Management',
      description: 'Manage departments and teams',
      icon: <GroupIcon className={classes.icon} />,
      path: '/teams',
    },
  ];

  const handleFeatureClick = (path) => {
    setLoading(true);
    setTimeout(() => {
      history.push(path);
      setLoading(false);
    }, 500);
  };

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h4" className={classes.welcomeTitle}>
            Welcome to Biometric Attendance System
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Next-generation attendance management powered by AI
          </Typography>

          <Box className={classes.stats}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={classes.statItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Typography className={classes.statValue}>{stat.value}</Typography>
                <Typography className={classes.statLabel}>{stat.label}</Typography>
              </motion.div>
            ))}
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={classes.card}
                    onClick={() => handleFeatureClick(feature.path)}
                  >
                    <CardContent className={classes.cardContent}>
                      {feature.icon}
                      <Typography variant="h6" className={classes.featureTitle}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className={classes.description}>
                        {feature.description}
                      </Typography>
                      <Button
                        variant="contained"
                        className={classes.button}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Launch'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Box className={classes.quickActions}>
        <Tooltip title="Settings" placement="left" TransitionComponent={Zoom}>
          <IconButton className={classes.actionButton}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Help & Support" placement="left" TransitionComponent={Zoom}>
          <IconButton className={classes.actionButton}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Dashboard;
