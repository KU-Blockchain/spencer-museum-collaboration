import React, { useState } from "react";
import claimNFTABI from "../ABI/ClaimNFT.json";
import { saveClaimData } from "../client-api";

const ClaimComponent = ({ web3, contract, account, styles, logMessage }) => {
  const [userAddress, setUserAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nftDetected, setNftDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [connectedAddress, setConnectedAddress] = useState("");

  // Define claimNFTAddress
  const claimNFTAddress = "0x5104c25aa45c48774ea1f540913c8fdefe386606";

  // Define claimNFTContract
  const claimNFTContract = new web3.eth.Contract(
    claimNFTABI.abi,
    claimNFTAddress
  );

  const handleVerification = async () => {
    try {
      if (web3 && account) {
        setConnectedAddress(account);

        // Check for the NFT
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
    let claimSuccessful = false;

    while (!claimSuccessful) {
      try {
        if (web3 && nftDetected) {
          const claimNFTContract = new web3.eth.Contract(
            claimNFTABI.abi,
            claimNFTAddress
          );

          // Estimate the gas required for the transaction
          const gasLimit = await claimNFTContract.methods
            .claimLand(tokenId, userAddress)
            .estimateGas({ from: userAddress });

          // Get the current gas price
          const gasPrice = await web3.eth.getGasPrice();
          logMessage("Gas limit: " + gasLimit);

          const txData = claimNFTContract.methods
            .claimLand(tokenId, userAddress)
            .encodeABI();

          const nonce = await web3.eth.getTransactionCount(userAddress);
          const rawTransaction = {
            from: connectedAddress,
            to: claimNFTAddress,
            value: "0x0",
            gasLimit: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            nonce: web3.utils.toHex(nonce),
            data: txData,
          };

          const signedTx = await web3.eth.accounts.signTransaction(
            rawTransaction,
            privateKey
          );

          const txReceipt = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction
          );

          const timestamp = Date.now();
          await saveClaimData(userAddress, timestamp); // save to database

          logMessage("Transaction hash: " + txReceipt.transactionHash);
          logMessage("Land claimed");
          setNftDetected(false);
          claimSuccessful = true;
        } else {
          setErrorMessage(
            "Please verify the wallet and ensure the NFT is detected"
          );
          break;
        }
      } catch (error) {
        if (error.message.includes("insufficient funds")) {
          logMessage("Error: Insufficient funds, transferring more...");
          setErrorMessage("Error: Insufficient funds, transferring more...");
          try {
            await transferFunds(tokenId);
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
    return new Promise(async (resolve, reject) => {
      try {
        // Estimate gas required for the NFT claim transaction
        const gasLimit = await contract.methods
          .claimLand(tokenId, userAddress)
          .estimateGas({ from: userAddress });

        const gasPrice = await web3.eth.getGasPrice();

        // Calculate the required amount of Matic
        const requiredMatic = web3.utils
          .toBN(gasLimit)
          .mul(web3.utils.toBN(gasPrice));

        // Add a 10% buffer
        const bufferMultiplier = 1.1;
        const bufferedMatic = requiredMatic
          .mul(web3.utils.toBN(Math.round(bufferMultiplier * 2e18)))
          .div(web3.utils.toBN(1e18));

        const nonce = await web3.eth.getTransactionCount(connectedAddress);
        const rawTransaction = {
          from: connectedAddress,
          to: userAddress,
          value: web3.utils.toHex(bufferedMatic),
          gasLimit: web3.utils.toHex(21000),
          gasPrice: web3.utils.toHex(gasPrice),
          nonce: web3.utils.toHex(nonce),
        };

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [rawTransaction],
        });

        logMessage("Transaction hash (transfer): " + txHash);
        console.log("Funds transferred");
        logMessage("Amount transferred: " + web3.utils.toHex(bufferedMatic));

        // Wait for transaction confirmation
        web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
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

    await handleClaim(tokenId);
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
