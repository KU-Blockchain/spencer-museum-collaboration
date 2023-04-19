import React, { useState } from "react";
import Web3 from "web3";
import claimNFTABI from "../ABI/ClaimNFT.json"; // Import the ABI from a JSON file

const ClaimComponent = ({ styles, logMessage }) => {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nftDetected, setNftDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");

  const claimNFTAddress = "0xf43b8348111bd93509b14ff718d3cc17ab0fb62f";

  const handleVerification = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // Request account access
        const web3 = new Web3(window.ethereum);
        setProvider(web3);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const connectedAddress = accounts[0];
        setConnectedAddress(connectedAddress);

        // Check for the NFT
        const claimNFTContract = new web3.eth.Contract(
          claimNFTABI.abi,
          claimNFTAddress
        );
        const balance = await claimNFTContract.methods
          .balanceOf(userAddress)
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

  const handleClaim = async (tokenId) => {
    try {
      if (provider && nftDetected) {
        const claimNFTContract = new provider.eth.Contract(
          claimNFTABI.abi,
          claimNFTAddress
        );

        // Estimate the gas required for the transaction
        const gasLimit = await claimNFTContract.methods
          .claimLand(tokenId, userAddress)
          .estimateGas({ from: userAddress });

        // Get the current gas price
        const gasPrice = await provider.eth.getGasPrice();
        logMessage("Gas limit: " + gasLimit);

        const txData = claimNFTContract.methods
          .claimLand(tokenId, userAddress)
          .encodeABI();

        const nonce = await provider.eth.getTransactionCount(userAddress);
        const rawTransaction = {
          from: connectedAddress,
          to: claimNFTAddress,
          value: "0x0",
          gasLimit: provider.utils.toHex(gasLimit),
          gasPrice: provider.utils.toHex(gasPrice),
          nonce: provider.utils.toHex(nonce),
          data: txData,
        };

        const signedTx = await provider.eth.accounts.signTransaction(
          rawTransaction,
          privateKey
        );

        const txReceipt = await provider.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );

        logMessage("Transaction hash: " + txReceipt.transactionHash);
        logMessage("Land claimed");
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

  const transferFunds = async (claimNFTContract, tokenId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Estimate gas required for the NFT claim transaction
        const gasLimit = await claimNFTContract.methods
          .claimLand(tokenId, userAddress)
          .estimateGas({ from: userAddress });

        const gasPrice = await provider.eth.getGasPrice();

        // Calculate the required amount of Matic
        const requiredMatic = provider.utils
          .toBN(gasLimit)
          .mul(provider.utils.toBN(gasPrice));

        // Add a 10% buffer
        const bufferMultiplier = 1.1;
        const bufferedMatic = requiredMatic
          .mul(provider.utils.toBN(Math.round(bufferMultiplier * 2e18)))
          .div(provider.utils.toBN(1e18));

        const nonce = await provider.eth.getTransactionCount(connectedAddress);
        const rawTransaction = {
          from: connectedAddress,
          to: userAddress,
          value: provider.utils.toHex(bufferedMatic),
          gasLimit: provider.utils.toHex(21000),
          gasPrice: provider.utils.toHex(gasPrice),
          nonce: provider.utils.toHex(nonce),
        };

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [rawTransaction],
        });

        logMessage("Transaction hash (transfer): " + txHash);
        console.log("Funds transferred");
        logMessage("Amount transferred: " + provider.utils.toHex(bufferedMatic));

        // Wait for transaction confirmation
        provider.eth.getTransactionReceipt(txHash, (error, receipt) => {
          if (error) {
            reject("Error getting transaction receipt: " + error.message);
          } else {
            resolve(receipt);
          }
        });
      } catch (error) {
        reject("Error transferring funds: " + error.message);
      }
    });
  };

  const handleClaimProcess = async () => {
    const claimNFTContract = new provider.eth.Contract(
      claimNFTABI.abi,
      claimNFTAddress
    );
    logMessage("Claim Initiated...");

    const activeTokenCount = await claimNFTContract.methods
      .activeTokenCount()
      .call();
    console.log("activeTokenCount: " + activeTokenCount);
    let tokenId = 0;

    console.log("active token count: " + activeTokenCount);
    for (let i = 0; i < activeTokenCount; i++) {
      const currentTokenId = await claimNFTContract.methods
        .activeTokenIdByIndex(i)
        .call();
      console.log("currentTokenId: " + currentTokenId);
      console.log("i: " + i);
      if (
        (await claimNFTContract.methods.ownerOf(currentTokenId).call()) ===
        userAddress
      ) {
        tokenId = currentTokenId; // Use the correct token ID here, not the index
  
        break;
      }
    }


    try {
      logMessage("Token ID: " + tokenId);
      await transferFunds(claimNFTContract, tokenId);
      await handleClaim(tokenId);
    } catch (error) {
      logMessage("Error: " + error.message);
      setErrorMessage("Error: " + error.message);
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
          />
          <input
            type="password"
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={handleClaimProcess}
            style={styles.button}
            disabled={!nftDetected}
          >
            Claim Land
          </button>
        </>
      )}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default ClaimComponent;
