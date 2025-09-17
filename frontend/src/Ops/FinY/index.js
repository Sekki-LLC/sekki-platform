import React from 'react';
import ReactDOM from 'react-dom/client';
import FinY from './FinY';
import './FinY.module.css';

// Font Awesome CSS (if not already included globally)
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FinY />
  </React.StrictMode>
);

export default FinY;

