import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Paper, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  webcam: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
        <Typography variant="h5" gutterBottom>
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
          color="primary"
          onClick={captureAndSubmit}
          disabled={loading}
          className={classes.button}
        >
          {loading ? <CircularProgress size={24} /> : 'Mark Attendance'}
        </Button>

        {message && (
          <Typography color={message.includes('error') ? 'error' : 'primary'}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default FaceRecognition;
