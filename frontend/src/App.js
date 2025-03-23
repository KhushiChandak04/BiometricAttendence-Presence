import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
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
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/face-recognition" element={<FaceRecognition />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
