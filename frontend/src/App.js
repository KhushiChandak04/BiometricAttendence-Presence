import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Box, IconButton, useMediaQuery } from '@material-ui/core';
import { Brightness4, Brightness7 } from '@material-ui/icons';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FaceRecognition from './components/FaceRecognition';
import QRScanner from './components/QRScanner';
import Registration from './components/Registration';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: mode,
          primary: {
            main: mode === 'dark' ? '#FF0080' : '#2196F3',
            light: mode === 'dark' ? '#FF1493' : '#64B5F6',
            dark: mode === 'dark' ? '#C51162' : '#1976D2',
            contrastText: '#fff',
          },
          secondary: {
            main: mode === 'dark' ? '#00F5FF' : '#FF4081',
            light: mode === 'dark' ? '#18FFFF' : '#FF80AB',
            dark: mode === 'dark' ? '#00B8D4' : '#C51162',
            contrastText: '#fff',
          },
          background: {
            default: mode === 'dark' ? '#000428' : '#f5f5f5',
            paper: mode === 'dark' ? '#121212' : '#fff',
          },
          text: {
            primary: mode === 'dark' ? '#fff' : '#000',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          },
          error: {
            main: mode === 'dark' ? '#ff1744' : '#f44336',
          },
          success: {
            main: mode === 'dark' ? '#00e676' : '#4caf50',
          },
        },
        typography: {
          fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          h2: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          h3: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          h4: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          h5: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          h6: {
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
        },
        shape: {
          borderRadius: 10,
        },
        overrides: {
          MuiCssBaseline: {
            '@global': {
              body: {
                background: mode === 'dark'
                  ? 'linear-gradient(45deg, #000428 30%, #004e92 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                minHeight: '100vh',
                transition: 'background 0.3s ease-in-out',
              },
            },
          },
          MuiButton: {
            root: {
              textTransform: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
            },
            contained: {
              boxShadow: mode === 'dark'
                ? '0 3px 15px 2px rgba(255, 0, 128, 0.3)'
                : '0 3px 15px 2px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                boxShadow: mode === 'dark'
                  ? '0 6px 20px 4px rgba(255, 0, 128, 0.4)'
                  : '0 6px 20px 4px rgba(33, 150, 243, 0.4)',
              },
            },
          },
          MuiPaper: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="App">
          <Box
            position="fixed"
            top={16}
            right={16}
            zIndex={1100}
          >
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              style={{
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/face-recognition" component={FaceRecognition} />
            <Route path="/qr-scanner" component={QRScanner} />
            <Route path="/register" component={Registration} />
          </Switch>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
