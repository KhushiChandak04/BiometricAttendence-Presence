import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const Root = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '500px',
}));

const ReaderContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Message = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const QRScanner = () => {

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
    <Container maxWidth="sm">
      <Root>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            QR Code Attendance
          </Typography>

          <ReaderContainer>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              facingMode="environment"
              style={{ width: '100%' }}
            />
          </ReaderContainer>

          {loading && <CircularProgress />}
          
          {message && (
            <Message 
              color={message.includes('error') ? 'error' : 'primary'}
            >
              {message}
            </Message>
          )}
        </StyledPaper>
      </Root>
    </Container>
  );
};

export default QRScanner;
