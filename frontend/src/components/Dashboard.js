import React, { useContext } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  makeStyles, 
  Card,
  CardContent,
  useTheme,
  IconButton,
  Box,
  Avatar,
} from '@material-ui/core';
import { 
  Face as FaceIcon,
  CropFree as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import presenceLogo from '../assets/presence-logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: theme.palette.type === 'dark'
        ? `repeating-linear-gradient(
            transparent 0,
            rgba(32, 43, 67, 0.3) 2px,
            transparent 4px
          )`
        : `repeating-linear-gradient(
            transparent 0,
            rgba(144, 202, 249, 0.2) 2px,
            transparent 4px
          )`,
      animation: '$gridMove 20s linear infinite',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.palette.type === 'dark'
        ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.2) 0%, transparent 60%)'
        : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 60%)',
      animation: '$pulse 4s ease-in-out infinite',
    }
  },
  '@keyframes gridMove': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg)',
    },
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.5 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.5 },
  },
  container: {
    position: 'relative',
    zIndex: 1,
    paddingTop: theme.spacing(4),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(6),
    position: 'relative',
  },
  logoContainer: {
    width: '180px',
    height: '180px',
    marginBottom: theme.spacing(3),
    animation: '$float 6s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    color: theme.palette.type === 'dark' ? '#ffffff' : '#1a237e',
    fontWeight: 800,
    fontSize: '2.5rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    textShadow: theme.palette.type === 'dark' 
      ? '0 0 20px rgba(33, 150, 243, 0.7)'
      : '0 0 20px rgba(25, 118, 210, 0.4)',
    fontFamily: "'Orbitron', sans-serif",
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  themeToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.type === 'dark' ? '#ffffff' : '#1a237e',
  },
  statsCard: {
    background: theme.palette.type === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: `1px solid ${theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(25, 118, 210, 0.2)'}`,
    padding: theme.spacing(4),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 8px 30px rgba(33, 150, 243, 0.3)'
        : '0 8px 30px rgba(25, 118, 210, 0.2)',
    },
  },
  statsValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: theme.palette.type === 'dark' ? '#2196F3' : '#1976d2',
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(33, 150, 243, 0.3)'
      : '0 0 10px rgba(25, 118, 210, 0.2)',
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  statsLabel: {
    color: theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textAlign: 'center',
  },
  actionCard: {
    height: '250px',
    background: theme.palette.type === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: `1px solid ${theme.palette.type === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(25, 118, 210, 0.2)'}`,
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-5px) scale(1.02)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 8px 30px rgba(33, 150, 243, 0.3)'
        : '0 8px 30px rgba(25, 118, 210, 0.2)',
      '& $cardIcon': {
        transform: 'scale(1.1) rotate(5deg)',
      },
      '& $cardOverlay': {
        opacity: 1,
      },
    },
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(3),
  },
  cardIcon: {
    fontSize: '5rem',
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'dark' ? '#2196F3' : '#1976d2',
    transition: 'all 0.3s ease-in-out',
    filter: theme.palette.type === 'dark'
      ? 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))'
      : 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.3))',
  },
  cardTitle: {
    color: theme.palette.type === 'dark' ? '#ffffff' : '#1a237e',
    fontWeight: 600,
    fontSize: '1.4rem',
    textAlign: 'center',
    letterSpacing: '0.05em',
    marginBottom: theme.spacing(2),
  },
  cardDescription: {
    color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 1,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={classes.root}
      >
        <Container maxWidth="lg" className={classes.container}>
          <Box className={classes.header}>
            <motion.div 
              className={classes.logoContainer}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <img src={presenceLogo} alt="Presence+ Logo" className={classes.logo} />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h3" className={classes.title}>
                Presence+
              </Typography>
              <Typography variant="h6" className={classes.subtitle}>
                Advanced Biometric Attendance System
              </Typography>
            </motion.div>

            <IconButton 
              onClick={toggleTheme} 
              className={classes.themeToggle}
              aria-label="toggle theme"
            >
              {theme.palette.type === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          <Grid container spacing={4}>
            {/* Stats Section */}
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper className={classes.statsCard}>
                  <Typography className={classes.statsValue}>150</Typography>
                  <Typography className={classes.statsLabel}>Total Employees</Typography>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper className={classes.statsCard}>
                  <Typography className={classes.statsValue}>127</Typography>
                  <Typography className={classes.statsLabel}>Present Today</Typography>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper className={classes.statsCard}>
                  <Typography className={classes.statsValue}>92%</Typography>
                  <Typography className={classes.statsLabel}>Attendance Rate</Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* Action Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/face-recognition')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <FaceIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>Face Recognition</Typography>
                  <Typography className={classes.cardDescription}>
                    Mark attendance using advanced facial recognition technology
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/qr-code')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <QrCodeIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>QR Code</Typography>
                  <Typography className={classes.cardDescription}>
                    Quick and secure attendance using QR code scanning
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/register')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <PersonAddIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>Register Employee</Typography>
                  <Typography className={classes.cardDescription}>
                    Add new employees to the biometric system
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/reports')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <AssessmentIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>View Reports</Typography>
                  <Typography className={classes.cardDescription}>
                    Analyze attendance data and generate reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
