import React, { useState, useEffect } from "react";
import Web3 from "web3";
import claimNFTABI from "../ABI/ClaimNFT.json"; // Import the ABI from a JSON file

const ClaimComponent = ({ styles }) => {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nftDetected, setNftDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const claimNFTAddress = "0xd6f725ea2625ac557d2704054b2a4c6cd1fb99b6";

  const handleVerification = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setProvider(web3);

        // Connect to the Polygon Mumbai testnet
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        setUserAddress(address);
        console.log("User address: ", address);

        // Check for the NFT
        const claimNFTContract = new web3.eth.Contract(
          claimNFTABI.abi,
          claimNFTAddress
        );
        const balance = await claimNFTContract.methods
          .balanceOf(address)
          .call();

        if (balance > 0) {
          setNftDetected(true);
          console.log("NFT detected");
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
    }
  };

  const handleClaim = async () => {
    try {
      if (provider && nftDetected) {
        const claimNFTContract = new Web3.eth.Contract(claimNFTABI.abi, claimNFTAddress);

        // Find the tokenId of the NFT
        const tokenId = await claimNFTContract.methods.tokenOfOwnerByIndex(userAddress, 0).call();

// Call the claimLand function
const tx = await claimNFTContract.methods.claimLand(tokenId).send({ from: userAddress });


        console.log("Land claimed");
        setNftDetected(false);
      } else {
        setErrorMessage(
          "Please verify the wallet and ensure the NFT is detected"
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Claim</h2>
      <input
        type="text"
        placeholder="Public Key"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleVerification} style={styles.button}>
        Verify Wallet
      </button>
      <button
        onClick={handleClaim}
        style={styles.button}
        disabled={!nftDetected}
      >
        Claim Land
      </button>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default ClaimComponent;
