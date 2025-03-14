import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FaceRecognition from './components/FaceRecognition';
import QRScanner from './components/QRScanner';
import Registration from './components/Registration';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/face-recognition" component={FaceRecognition} />
            <Route path="/qr-scanner" component={QRScanner} />
            <Route path="/register" component={Registration} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
