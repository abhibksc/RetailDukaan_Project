import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Updated import for React 18
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import Store from './Components/ReduxStore';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f4f6f8",
    },
  },
});

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root with React 18 API
const root = createRoot(rootElement);

// Render the App inside the Provider with the Redux store and BrowserRouter
root.render(
  // <StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
  <Provider store={Store}>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <App className="scrollbar-hidden" />
    </BrowserRouter>
  </Provider>
  </ThemeProvider>
  // </StrictMode>
);
