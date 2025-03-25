import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          employeeId: '',
          email: '',
          department: '',
          position: ''
        });
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to register employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" gutterBottom>
          Employee Registration
        </Typography>

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Employee registered successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="employeeId"
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="department"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="position"
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

          <StyledButton
            type="submit"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Registering...' : 'Register Employee'}
          </StyledButton>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Registration;
