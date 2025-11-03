import React from 'react';

const LoadingSpinner = ({ label = 'Fetching curated menus...' }) => (
  <div className="loading">
    <span className="loading__spinner" aria-hidden />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
