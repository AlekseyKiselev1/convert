import React from 'react';
import ReactDOM from 'react-dom/client'; // Измените на 'react-dom/client'
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Создайте корень
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);