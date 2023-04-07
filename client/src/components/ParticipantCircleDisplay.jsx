import React from 'react';

const ParticipantCircleDisplay = ({ styles }) => {
  const circleCount = 5;
  const circleRadius = 40;
  const squareSize = 50;
  const orbitRadius = 120;
  const orbitCenter = {
    x: 150,
    y: 150,
  };

  const circlePositions = Array.from({ length: circleCount }, (_, i) => {
    const angle = (i / circleCount) * Math.PI * 2;
    const x = orbitCenter.x + Math.cos(angle) * orbitRadius;
    const y = orbitCenter.y + Math.sin(angle) * orbitRadius;
    return { x, y };
  });

  return (
    <div style={styles.section}>
      <div style={{ position: 'relative', width: `${2 * orbitRadius}px`, height: `${2 * orbitRadius}px` }}>
        {circlePositions.map((position, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${position.y - orbitCenter.y + orbitRadius - circleRadius}px`,
              left: `${position.x - orbitCenter.x + orbitRadius - circleRadius}px`,
              width: `${circleRadius}px`,
              height: `${circleRadius}px`,
              borderRadius: '50%',
              backgroundColor: '#F9C2FF',
              border: '2px solid #000000',
            }}
          ></div>
        ))}
        <div
          style={{
            position: 'absolute',
            top: `${orbitRadius - squareSize / 2}px`,
            left: `${orbitRadius - squareSize / 2}px`,
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            backgroundColor: '#BFEFFF',
            border: '2px solid #000000',
          }}
        ></div>
      </div>
    </div>
  );
};

const appStyles = {
  section: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: '1px solid #000000',
  },
};

export default ParticipantCircleDisplay;
