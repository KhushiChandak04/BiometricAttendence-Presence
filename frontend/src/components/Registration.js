import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { 
  Button, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  CircularProgress 
} from '@material-ui/core';
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
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  webcam: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2, 0),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));

const Registration = () => {
  const classes = useStyles();
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
      // Clear form on success
      setFormData({ name: '', employee_id: '' });
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
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        {message && (
          <Typography 
            color={message.includes('error') ? 'error' : 'primary'}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Registration;
