// src/components/Loading.js
import React from 'react';

const Dot = ({ delay }) => {
    const styles = {
      animation: `dotPulse ${1}s infinite`,
      animationDelay: `${delay}s`,
      backgroundColor: "#FFF",
      borderRadius: "50%",
      display: "inline-block",
      height: "5px",
      marginLeft: "2px",
      width: "5px",
    };
  
    return <span style={styles}></span>;
  };
  

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
      spinner: {
        border: '8px solid rgba(255, 255, 255, 0.1)',
        borderTop: '8px solid #F9C2FF',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
      },
      text: {
        marginTop: '10px',
        color: '#fff',
        fontSize: '1.2rem',
        fontFamily: "Courier New, monospace",
      },
    };

    return (
        <div style={styles.container}>
          <div style={styles.spinner}></div>
          <p style={styles.text}>
            {message}
            <Dot delay={0.2} />
            <Dot delay={0.4} />
            <Dot delay={0.6} />
          </p>
        </div>
      );
    };
    
    export default Loading;