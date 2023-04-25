// src/components/Loading.js
import React from 'react';

const Loading = ({ message }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      zIndex: 999, // Ensure the loading component is always on top
    },
    spinner: {
      border: '8px solid rgba(255, 255, 255, 0.1)',
      borderTop: '8px solid #3498db', // Primary color
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '10px',
      color: '#fff',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

export default Loading;
