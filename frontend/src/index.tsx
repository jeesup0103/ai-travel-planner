import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import { authService } from './services/authService';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.error('Google Client ID is not configured. Please check your .env file.');
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
authService.setupAxiosInterceptors();
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ''}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);