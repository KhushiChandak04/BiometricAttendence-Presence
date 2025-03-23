import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FaceRecognition from './components/FaceRecognition';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/face-recognition" element={<FaceRecognition />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
