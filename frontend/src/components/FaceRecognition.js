import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Paper, Typography, CircularProgress, Box } from '@material-ui/core';
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
  webcamContainer: {
    position: 'relative',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  webcam: {
    borderRadius: theme.spacing(1),
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  faceBox: {
    position: 'absolute',
    border: '2px solid #4CAF50',
    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
    transition: 'all 0.3s ease-in-out',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-5px',
      left: '-5px',
      right: '-5px',
      bottom: '-5px',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      borderRadius: '5px',
      animation: '$pulse 2s infinite',
    },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.4,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#4CAF50',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    zIndex: 2,
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
  techDetails: {
    color: '#4CAF50',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.spacing(1),
    width: '100%',
    maxWidth: '400px',
  },
}));

const FaceRecognition = () => {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [techInfo, setTechInfo] = useState({
    fps: 0,
    confidence: 0,
    status: 'Waiting for face...',
    landmarks: 0,
  });

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

  useEffect(() => {
    let frameCount = 0;
    let lastTime = Date.now();
    
    const updateFPS = () => {
      const now = Date.now();
      const elapsed = now - lastTime;
      if (elapsed >= 1000) {
        setTechInfo(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / elapsed),
        }));
        frameCount = 0;
        lastTime = now;
      }
      frameCount++;
    };

    const interval = setInterval(updateFPS, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const captureAndSubmit = async () => {
    try {
      setLoading(true);
      setMessage('');
      setTechInfo(prev => ({ ...prev, status: 'Processing...' }));

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
      setTechInfo(prev => ({
        ...prev,
        confidence: response.data.confidence * 100 || 0,
        status: 'Face recognized!',
        landmarks: 468, // MediaPipe Face Mesh uses 468 landmarks
      }));
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
      setTechInfo(prev => ({
        ...prev,
        status: 'Error: ' + (error.response?.data?.error || 'Recognition failed'),
        confidence: 0,
      }));
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
        
        <div className={classes.webcamContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className={classes.webcam}
            width={400}
            height={300}
          />
          
          {faceDetected && (
            <div
              className={classes.faceBox}
              style={{
                left: `${facePosition.x}px`,
                top: `${facePosition.y}px`,
                width: `${facePosition.width}px`,
                height: `${facePosition.height}px`,
              }}
            />
          )}
          
          <div className={classes.detailsOverlay}>
            <div>FPS: {techInfo.fps}</div>
            <div>Status: {techInfo.status}</div>
            <div>Confidence: {techInfo.confidence.toFixed(1)}%</div>
            <div>Landmarks: {techInfo.landmarks}</div>
          </div>
        </div>

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
        
        <Box className={classes.techDetails}>
          <Typography variant="caption">Technical Details:</Typography>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            {JSON.stringify({
              model: 'MediaPipe Face Mesh',
              landmarks: techInfo.landmarks,
              confidence: `${techInfo.confidence.toFixed(1)}%`,
              fps: techInfo.fps,
              status: techInfo.status,
            }, null, 2)}
          </pre>
        </Box>
      </Paper>
    </Container>
  );
};

export default FaceRecognition;
