import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import anime from 'animejs';

const DriftingCircles = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const socket = io("http://localhost:5001");
  
    socket.on('newWallet', (newWalletData) => {
      // Update the wallets state and regenerate the circles
      generateCircle();
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const generateCircle = () => {
    const circle = document.createElement('div');
    circle.style.width = '40px';
    circle.style.height = '40px';
    circle.style.borderRadius = '50%';
    circle.style.border = '2px solid #000000';
    circle.style.backgroundColor = "#F9C2FF";
    circle.style.position = 'absolute';

    const containerSize = 400;
    const circleSize = 40;
    const containerWidth = containerSize - circleSize;
    const containerHeight = containerSize - circleSize;
    const initialLeft = Math.random() * containerWidth;
    const initialTop = Math.random() * containerHeight;
    circle.style.left = `${initialLeft}px`;
    circle.style.top = `${initialTop}px`;

    containerRef.current.appendChild(circle);

    anime({
      targets: circle,
      left: [
        { value: `${initialLeft}px`, duration: 0 },
        { value: () => `${Math.random() * containerWidth}px`, duration: 3000 },
        { value: () => `${Math.random() * containerWidth}px`, duration: 3000 },
      ],
      top: [
        { value: `${initialTop}px`, duration: 0 },
        { value: () => `${Math.random() * containerHeight}px`, duration: 3000 },
        { value: () => `${Math.random() * containerHeight}px`, duration: 3000 },
      ],
      loop: true,
      easing: 'linear',
      direction: 'alternate',
    });
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '50vh',
          height: '30vh',
          position: 'relative',
          overflow: 'hidden',
          //border: '1px solid black',
          background: 'white',
          marginBottom: '10px',
        }}
      ></div>
    </div>
  );
};

export default DriftingCircles;
