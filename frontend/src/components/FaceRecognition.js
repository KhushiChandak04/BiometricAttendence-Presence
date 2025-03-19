import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Paper, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: `repeating-linear-gradient(
        transparent 0,
        rgba(32, 43, 67, 0.3) 2px,
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
      background: 'radial-gradient(circle at center, transparent 0%, #1a1a2e 70%)',
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
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    zIndex: 1,
    animation: '$float 6s ease-in-out infinite',
    margin: theme.spacing(4),
  },
  webcam: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  button: {
    margin: theme.spacing(2),
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    padding: '10px 30px',
    '&:hover': {
      background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    },
  },
  title: {
    color: '#ffffff',
    fontWeight: 600,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    marginBottom: theme.spacing(3),
  },
  message: {
    color: '#ffffff',
    marginTop: theme.spacing(2),
  },
}));

const FaceRecognition = () => {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported');
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  };

  const captureAndSubmit = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Capture image
      const imageSrc = webcamRef.current.getScreenshot();
      
      // Get location
      const location = await getCurrentLocation();

      // Submit to backend
      const response = await axios.post('http://localhost:5000/api/attendance/face', {
        face_image: imageSrc,
        location: location,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" gutterBottom className={classes.title}>
          Face Recognition Attendance
        </Typography>
        
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={classes.webcam}
        />

        <Button
          variant="contained"
          className={classes.button}
          onClick={captureAndSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Mark Attendance'}
        </Button>
        
        {message && (
          <Typography variant="body1" className={classes.message}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default FaceRecognition;
