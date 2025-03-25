import React, { useState, useRef } from 'react';
import { Container, Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Camera as CameraIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import Webcam from 'react-webcam';
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
  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
}));

const WebcamContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: '400px',
  '& video': {
    width: '100%',
    borderRadius: '10px',
    border: '2px solid rgba(33, 150, 243, 0.5)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  borderRadius: '25px',
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    transform: 'scale(1.02)',
  }
}));

const FaceRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const handleCapture = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      const response = await axios.post('http://localhost:5000/api/recognize', {
        image: imageSrc
      });

      // Set success state based on response
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response.data.message || 'Face recognition failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to recognize face');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <StyledPaper elevation={3}>
        <CameraIcon sx={{ fontSize: 40, mb: 2, color: '#2196F3' }} />
        <Typography component="h1" variant="h5">
          Face Recognition
        </Typography>

        <WebcamContainer>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 400,
              height: 300,
              facingMode: "user"
            }}
          />
        </WebcamContainer>

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon color="success" />
            <Typography color="success.main">
              Attendance marked successfully!
            </Typography>
          </Box>
        )}

        <StyledButton
          fullWidth
          onClick={handleCapture}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CameraIcon />}
        >
          {loading ? 'Processing...' : 'Capture & Recognize'}
        </StyledButton>
      </StyledPaper>
    </Container>
  );
};

export default FaceRecognition;
