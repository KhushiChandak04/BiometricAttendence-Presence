import React, { useState, useRef, useContext } from 'react';
import Webcam from 'react-webcam';
import { 
  Button, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  CircularProgress,
  IconButton,
  Switch,
  Box,
  useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness4, Brightness7 } from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(45deg, #000428 30%, #004e92 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    transition: 'background 0.3s ease-in-out',
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
    background: theme.palette.type === 'dark' 
      ? 'rgba(18, 18, 18, 0.8)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark'
      ? '1px solid rgba(81, 81, 81, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
    boxShadow: theme.palette.type === 'dark'
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  webcam: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: '10px',
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
  },
  button: {
    margin: theme.spacing(2, 0),
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(45deg, #FF0080 30%, #FF8C00 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: '#fff',
    textTransform: 'none',
    fontSize: '1.1rem',
    padding: '12px',
    borderRadius: '10px',
    '&:hover': {
      background: theme.palette.type === 'dark'
        ? 'linear-gradient(45deg, #FF8C00 30%, #FF0080 90%)'
        : 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
      boxShadow: '0 3px 15px 2px rgba(255, 105, 135, .3)',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      background: theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
      borderColor: theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)',
    },
  },
  themeToggle: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: theme.spacing(3),
    textShadow: theme.palette.type === 'dark'
      ? '0 0 10px rgba(255, 0, 128, 0.5)'
      : '0 0 10px rgba(33, 150, 243, 0.5)',
  },
}));

const Registration = () => {
  const classes = useStyles();
  const theme = useTheme();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.employee_id) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setMessage('Failed to capture image');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/register', {
        ...formData,
        face_image: imageSrc,
      });

      setMessage(response.data.message);
      setFormData({ name: '', employee_id: '' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" className={classes.title}>
            Employee Registration
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              className={classes.textField}
              variant="outlined"
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              InputLabelProps={{
                style: { color: theme.palette.text.primary }
              }}
            />

            <TextField
              className={classes.textField}
              variant="outlined"
              required
              fullWidth
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              InputLabelProps={{
                style: { color: theme.palette.text.primary }
              }}
            />

            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className={classes.webcam}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.button}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Employee'}
            </Button>
          </form>

          {message && (
            <Typography 
              style={{
                color: message.includes('error') 
                  ? theme.palette.error.main 
                  : theme.palette.success.main,
                marginTop: theme.spacing(2),
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Registration;
