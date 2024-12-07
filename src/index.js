// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional, you can add custom styles here
import App from './App';
import 'leaflet/dist/leaflet.css';  // Import Leaflet's CSS for proper styling

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Make sure you have an element with id="root" in index.html
);
