import React, { useContext } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card,
  CardContent,
  useTheme,
  IconButton,
} from '@mui/material';
import { 
  Face as FaceIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const Root = styled('div')(({ theme }) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
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
        ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  title: {
    color: theme.palette.type === 'dark' ? '#ffffff' : '#1a237e',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textShadow: theme.palette.type === 'dark' 
      ? '0 0 10px rgba(33, 150, 243, 0.5)'
      : '0 0 10px rgba(25, 118, 210, 0.3)',
    fontFamily: "'Orbitron', sans-serif",
  },
  themeToggle: {
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
    padding: theme.spacing(3),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 8px 30px rgba(33, 150, 243, 0.3)'
        : '0 8px 30px rgba(25, 118, 210, 0.2)',
    },
  },
  statsValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.palette.type === 'dark' ? '#2196F3' : '#1976d2',
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(33, 150, 243, 0.3)'
      : '0 0 10px rgba(25, 118, 210, 0.2)',
    marginBottom: theme.spacing(1),
  },
  statsLabel: {
    color: theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  actionCard: {
    height: '200px',
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
  },
  cardIcon: {
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.type === 'dark' ? '#2196F3' : '#1976d2',
    transition: 'all 0.3s ease-in-out',
    filter: theme.palette.type === 'dark'
      ? 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))'
      : 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.3))',
  },
  cardTitle: {
    color: theme.palette.type === 'dark' ? '#ffffff' : '#1a237e',
    fontWeight: 600,
    fontSize: '1.2rem',
    textAlign: 'center',
    letterSpacing: '0.05em',
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
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  const navigateTo = (path) => {
    navigate(path);
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
          <div className={classes.header}>
            <Typography variant="h4" className={classes.title}>
              Biometric Attendance System
            </Typography>
            <IconButton 
              onClick={toggleTheme} 
              className={classes.themeToggle}
              aria-label="toggle theme"
            >
              {theme.palette.type === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </div>

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
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/qr-code')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <QrCodeIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>QR Code</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/register')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <PersonAddIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>Register Employee</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.actionCard} onClick={() => navigateTo('/reports')}>
                <div className={classes.cardOverlay} />
                <CardContent className={classes.cardContent}>
                  <AssessmentIcon className={classes.cardIcon} />
                  <Typography className={classes.cardTitle}>View Reports</Typography>
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
