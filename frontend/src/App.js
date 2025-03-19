import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Box } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FaceRecognition from './components/FaceRecognition';
import QRScanner from './components/QRScanner';
import Registration from './components/Registration';
import { ThemeContextProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <Box>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/face-recognition" component={FaceRecognition} />
            <Route path="/qr-code" component={QRScanner} />
            <Route path="/register" component={Registration} />
          </Switch>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
