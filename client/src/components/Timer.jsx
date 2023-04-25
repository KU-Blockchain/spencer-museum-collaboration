import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Timer = () => {
    console.log("Timer.jsx")
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5001"); // Use the server URL

    socket.on("claimInitiated", (timestamp) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setTimeRemaining(120 * 1000); // Set initial timer value (2 minutes)
      const newIntervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(newIntervalId);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
      setIntervalId(newIntervalId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor(ms / 1000 / 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      {timeRemaining !== null && (
        <div>
          Time remaining: <strong>{formatTime(timeRemaining)}</strong>
        </div>
      )}
    </div>
  );
};

export default Timer;
