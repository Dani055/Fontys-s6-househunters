import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'jquery';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserProvider';
import { ThemeProvider } from '@emotion/react';
import {createTheme} from '@mui/material/styles'
const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'Verdana',
      'sans-serif',
    ].join(','),
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <UserProvider>
      <App />
    </UserProvider>
  </ThemeProvider>
);


reportWebVitals();
