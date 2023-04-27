import React, { useState, useEffect, useCallback } from "react";
import socketIOClient from "socket.io-client";
import { burnSpecificClaimNFTs, clearStoredClaims } from "../client-api";

const Timer = ({
  styles,
  logMessage,
  showLoading,
  hideLoading,
}) => {
  console.log("Timer.jsx");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);


  const fetchClaims = async () => {
    try {
      const response = await fetch("http://localhost:5001/claims");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching claims:", error);
      return [];
    }
  };

  const burnNFTs = async (walletAddresses) => {

    try {
      showLoading("Destroying NFTs");
      await burnSpecificClaimNFTs(walletAddresses);
      console.log("Specified NFTs have been burned.");
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error("Error details:", error);
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  const TimeEndingHandler = useCallback(async () => {
    const claims = await fetchClaims();
    const claimsCount = claims.length;

    const threshold = 6;

    if (claimsCount <= threshold) {
      const walletAddresses = claims.map((claim) => claim.walletAddress);
      await burnNFTs(walletAddresses);
      
    } else {
      console.log("Threshold amount exceeded. Fractionalization should occur.");
    }
    clearStoredClaims();
    console.log("claims cleared")
  });

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5001");

    socket.on("claimInitiated", (timestamp) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      //setTimeRemaining(120 * 1000);
      setTimeRemaining(30 * 1000);
      const newIntervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(newIntervalId);
            TimeEndingHandler();
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
  }, [TimeEndingHandler, intervalId]);

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
          <p fontSize="2.0rem">
            Time remaining: <strong>{formatTime(timeRemaining)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;
