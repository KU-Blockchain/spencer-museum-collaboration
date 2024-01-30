import React, { useState, useEffect, useCallback } from "react";
import socketIOClient from "socket.io-client";
import { burnSpecificClaimNFTs, clearStoredClaims } from "../client-api";

const API_URL = process.env.REACT_APP_API_URL;
const Timer = ({ styles, logMessage, showLoading, hideLoading }) => {
  console.log("Timer.jsx");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const fetchClaims = async () => {
    try {
      const response = await fetch(`{API_URL}/claims`);
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

    const threshold = 2;

    if (claimsCount < threshold) {
      const walletAddresses = claims.map((claim) => claim.walletAddress);
      await burnNFTs(walletAddresses);
      logMessage("There were " + claimsCount + " claims.");
      logMessage("The threshold amount was " + threshold + ".");
      logMessage(
        "All wallets which have attempted to claim will now have their NFTs burned."
      );
    } else {
      console.log("Threshold amount exceeded. Fractionalization should occur.");
      logMessage("There were " + claimsCount + " claims.");
      logMessage("The threshold amount was " + threshold + ".");
      logMessage("Fractionalization should occur.");
    }
    clearStoredClaims();
    console.log("claims cleared");
    setTimeRemaining(null); // Reset timeRemaining to null after TimeEndingHandler has been executed
  }, []);

  useEffect(() => {
    const socket = socketIOClient(API_URL);

    socket.on("claimInitiated", (timestamp) => {
      // Check if timeRemaining is already set
      if (timeRemaining !== null) {
        console.log("Timer already exists. Skipping new timer.");
        return;
      }

      if (intervalId) {
        clearInterval(intervalId);
      }

      setTimeRemaining(45 * 1000); //45 seconds
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
  }, [TimeEndingHandler, intervalId, timeRemaining]);

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
