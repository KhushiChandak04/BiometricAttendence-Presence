import React, { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#1a1a2e' : '#e3f2fd',
        paper: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
      },
    },
    typography: {
      fontFamily: "'Roboto', 'Orbitron', sans-serif",
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@import': "url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap')",
        },
      },
    },
  });

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
