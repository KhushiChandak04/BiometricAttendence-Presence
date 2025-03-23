import React, { useContext } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Face as FaceIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(22, 33, 62, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' 
    ? theme.palette.primary.light 
    : theme.palette.primary.dark,
}));

const IconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '2rem',
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const features = [
    {
      title: 'Face Recognition',
      description: 'Mark attendance using facial recognition',
      icon: <FaceIcon />,
      path: '/face-recognition',
    },
    {
      title: 'QR Code Scanner',
      description: 'Scan QR code for quick attendance',
      icon: <QrCodeIcon />,
      path: '/qr-scanner',
    },
    {
      title: 'Registration',
      description: 'Register new employees',
      icon: <PersonAddIcon />,
      path: '/registration',
    },
    {
      title: 'Reports',
      description: 'View attendance reports and analytics',
      icon: <AssessmentIcon />,
      path: '/reports',
    },
  ];

  return (
    <Root>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              color: theme => theme.palette.mode === 'dark' ? '#fff' : '#333',
              textAlign: 'center',
              marginBottom: 4,
            }}>
              Biometric Attendance Dashboard
            </Typography>
          </Grid>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledCard onClick={() => navigate(feature.path)}>
                  <CardContent>
                    <IconWrapper>
                      {feature.icon}
                      <CardTitle variant="h6">
                        {feature.title}
                      </CardTitle>
                    </IconWrapper>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Container>
    </Root>
  );
};

export default Dashboard;
