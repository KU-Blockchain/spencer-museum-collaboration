import React, { useState, useEffect } from "react";
import claimNFTABI from "../ABI/ClaimNFT.json";
import { saveClaimData, executeClaim, initiateFundTransfer, getTokenIdByAddress } from "../client-api";
const API_URL = "http://localhost:5001";


const ClaimComponent = ({
  styles,
  logMessage,
  showLoading,
  hideLoading,
}) => {
  const [userAddress, setUserAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nftDetected, setNftDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      // Clear the timer when the component is unmounted or the error message changes
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleVerification = async () => {
    console.log("NFT detected (hardcoded response)");
    setNftDetected(true);
    /* try {
      if (web3 && account) {
        setConnectedAddress(account);

        // Check for the NFT
        const balance = await claimNFTContract.methods
          .balanceOf(userAddress)
          .call();

        if (balance > 0) {
          setNftDetected(true);
          
        } else {
          setErrorMessage("No ClaimNFT found in the wallet");
        }
      } else {
        setErrorMessage(
          "Please install MetaMask and connect to the Polygon Mumbai testnet"
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }*/
  };


  const handleClaim = async (tokenId) => {
    showLoading("Claiming NFT");
    let claimSuccessful = false;

    while (!claimSuccessful) {
      showLoading("Executing claim");
      try {
        const date = Date.now();
        const timestamp = new Date(date);
        const formattedDate = timestamp.toISOString().slice(0, -5) + "Z";


        await executeClaim(tokenId, userAddress); // call the client-api.js function
        hideLoading();
        await saveClaimData(userAddress, formattedDate); // save to database
        
        logMessage("Claim initiated");
        setNftDetected(false);
        claimSuccessful = true;
      } catch (error) {
        if (error.message.includes("insufficient funds")) {
          logMessage("Error: Insufficient funds, transferring more...");
          setErrorMessage("Error: Insufficient funds, transferring more...");
          try {
            await transferFunds(tokenId);
            await handleClaim(tokenId); // Retry the claim after transferring funds
          } catch (transferError) {
            logMessage("Error: " + transferError.message);
            setErrorMessage("Error: " + transferError.message);
            break;
          }
        } else {
          logMessage("Error: " + error.message);
          setErrorMessage("Error: " + error.message);
          break;
        }
      }
    }
  };

  const transferFunds = async (tokenId) => {
    try {
      const response = await initiateFundTransfer(tokenId, userAddress);
      if (response.status === "success") {
        logMessage("Amount transferred: " + response.transferredAmount);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw new Error("Error transferring funds: " + error.message);
    }
  };
  

  const handleClaimProcess = async () => {
    showLoading("Initiating claim");
    logMessage("Claim Initiated...");
  
    try {
      const tokenId = await getTokenIdByAddress(userAddress);
      console.log("tokenId: " + tokenId);
  
      await handleClaim(tokenId);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      hideLoading();
    }
  };
  

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Claim</h2>
      <input
        type="text"
        placeholder="Wallet Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleVerification} style={styles.button}>
        Verify Wallet
      </button>
      {nftDetected && (
        <>
          <input
            type="text"
            placeholder="Public Key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            style={styles.input}
            display="block"
          />
          <input
            type="password"
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            style={styles.input}
            display="block"
          />
          <button
            onClick={handleClaimProcess}
            style={styles.button}
            disabled={!nftDetected}
          >
            Claim
          </button>
        </>
      )}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default ClaimComponent;
