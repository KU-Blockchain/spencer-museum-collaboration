import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Timer = ({ contract }) => {
  console.log("Timer.jsx");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const fetchClaims = async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching claims:", error);
      return [];
    }
  };

  const burnNFTs = async (contract, walletAddresses) => {
    if (!contract) {
      console.log("Contract not found. Check MetaMask connection.");
      return;
    }

    try {
      await contract.methods.BurnSpecific(walletAddresses).send();
      console.log("Specified NFTs have been burned.");

      
    } catch (error) {
      console.error("Error details:", error);
    }
  };

  const TimeEndingHandler = async (contract) => {
    const claims = await fetchClaims();
    const claimsCount = claims.length;

    const threshold = 3;

    if (claimsCount <= threshold) {
      const walletAddresses = claims.map((claim) => claim.walletAddress);
      await burnNFTs(contract, walletAddresses);
    } else {
      console.log("Threshold amount exceeded");
    }
  };

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5001");

    socket.on("claimInitiated", (timestamp) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setTimeRemaining(120 * 1000);
      const newIntervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(newIntervalId);
            TimeEndingHandler(contract);
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
