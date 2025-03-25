import React, { useState } from 'react';
import { Container, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { QrCode2 as QrCodeIcon } from '@mui/icons-material';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const QRContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  margin: theme.spacing(2, 0),
  '& video': {
    width: '100%',
    borderRadius: '10px',
    border: '2px solid rgba(33, 150, 243, 0.5)',
  }
}));

const QRScanner = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (result) => {
    if (result && !loading) {
      setLoading(true);
      setError('');
      setSuccess(false);

      try {
        const response = await axios.post('http://localhost:5000/api/attendance/qr', {
          qr_data: result.text
        });

        if (response.data.success) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          throw new Error(response.data.message || 'Invalid QR code');
        }
      } catch (err) {
        setError(err.message || 'Failed to process QR code');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    setError('Failed to access camera: ' + err.message);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <StyledPaper elevation={3}>
        <QrCodeIcon sx={{ fontSize: 40, mb: 2, color: '#2196F3' }} />
        <Typography component="h1" variant="h5" gutterBottom>
          QR Code Scanner
        </Typography>

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Attendance marked successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <QRContainer>
          <QrScanner
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: 'environment' }
            }}
            style={{ width: '100%' }}
          />
        </QRContainer>

        {loading && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Processing...</Typography>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default QRScanner;
