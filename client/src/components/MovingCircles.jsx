import React, { useRef, useEffect } from "react";
import anime from "animejs";

const MovingCircles = ({ styles }) => {
  const circleCount = 5;
  const circleRadius = 40;
  const squareSize = 80;
  const orbitRadius = 140;
  const containerSize = 2 * (orbitRadius + circleRadius);

  const orbitCenter = {
    x: containerSize / 2,
    y: containerSize / 2,
  };

  const circlePositions = Array.from({ length: circleCount }, (_, i) => {
    const angle = (i / circleCount) * Math.PI * 2;
    const x = orbitCenter.x + Math.cos(angle) * orbitRadius;
    const y = orbitCenter.y + Math.sin(angle) * orbitRadius;
    return { x, y };
  });

  const circleRefs = useRef([]);

  useEffect(() => {
    circleRefs.current.forEach((circle, i) => {
      anime({
        targets: circle,
        translateX: [
          0,
          circlePositions[(i + 1) % circleCount].x - circlePositions[i].x,
        ],
        translateY: [
          0,
          circlePositions[(i + 1) % circleCount].y - circlePositions[i].y,
        ],
        duration: 4000,
        easing: "linear",
        loop: true,
      });
    });
  }, [circlePositions]);

  return (
    <div style={{ ...styles.section }}>
      <div style={{ position: "relative", height: `${containerSize}px` }}>
        <div
          style={{
            position: "absolute",
            width: `${containerSize}px`,
            height: `${containerSize}px`,
            top: `calc(50% - ${containerSize / 2}px)`,
            left: `calc(50% - ${containerSize / 2}px)`,
          }}
        >
          {circlePositions.map((position, i) => (
            <div
              key={i}
              ref={(el) => (circleRefs.current[i] = el)}
              style={{
                position: "absolute",
                top: `${position.y - circleRadius}px`,
                left: `${position.x - circleRadius}px`,
                width: `${circleRadius}px`,
                height: `${circleRadius}px`,
                borderRadius: "50%",
                backgroundColor: "#F9C2FF",
                border: "2px solid #000000",
              }}
            ></div>
          ))}
          <div
            style={{
              position: "absolute",
              top: `calc(50% - ${squareSize / 2}px)`,
              left: `calc(50% - ${squareSize / 2}px)`,
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              backgroundColor: "#BFEFFF",
              border: "2px solid #000000",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MovingCircles;
