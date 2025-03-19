import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { Container, Paper, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  reader: {
    width: '100%',
    maxWidth: '400px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  message: {
    marginTop: theme.spacing(2),
  },
}));

const QRScanner = () => {
  const classes = useStyles();
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

  const handleScan = async (data) => {
    if (data && !loading) {
      try {
        setLoading(true);
        setMessage('Processing QR code...');

        const location = await getCurrentLocation();

        const response = await axios.post('http://localhost:5000/api/attendance/qr', {
          qr_data: data,
          location: location,
        });

        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage('Error accessing camera');
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          QR Code Attendance
        </Typography>

        <div className={classes.reader}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            facingMode="environment"
            style={{ width: '100%' }}
          />
        </div>

        {loading && <CircularProgress />}
        
        {message && (
          <Typography 
            className={classes.message}
            color={message.includes('error') ? 'error' : 'primary'}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default QRScanner;
