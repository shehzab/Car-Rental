import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CarProvider>
        <App />
      </CarProvider>
    </AuthProvider>
  </React.StrictMode>
);
