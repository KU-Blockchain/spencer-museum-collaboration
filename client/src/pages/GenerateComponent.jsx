import React, { useState, useCallback, useEffect } from "react";
import emailjs from "emailjs-com"; // Import emailjs
import { ethers } from "ethers";
import {
  createWallet,
  updateData,
  resetGlobalVars,
  resetDatabase,
  incrementActiveWalletCount,
} from "../client-api"; // Assuming the functions are in a file named 'api.js'

const GenerateComponent = ({
  web3,
  contract,
  account,
  styles,
  logMessage,
  sendtoApp,
  showLoading,
  hideLoading
}) => {
  const [numWallets, setNumWallets] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [emailInputs, setEmailInputs] = useState(Array(numWallets).fill(""));

  // Add your EmailJS credentials here
  const emailjsUserId = "JMcPDIEBGca8QqOIV";
  const emailjsTemplateId = "template_qwekk94";
  const emailjsServiceId = "service_js0tfmo";

  useEffect(() => {
    setEmailInputs((prevEmailInputs) => {
      const newEmailInputs = Array(numWallets).fill("");
      prevEmailInputs.forEach((email, index) => {
        newEmailInputs[index] = email;
      });
      return newEmailInputs;
    });
  }, [numWallets]);

  useEffect(() => {
    if (contract) {
      getTotalSupply(contract);
    }
  }, [contract]);

  const sendEmails = useCallback(async () => {
    console.log("wallets length in send emails: " + wallets.length);

    const emailPromises = wallets.map((wallet, index) => {
      const emailData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        address: wallet.address,
        to_email: emailInputs[index],
      };

      return emailjs
        .send(emailjsServiceId, emailjsTemplateId, emailData, emailjsUserId)
        .then(
          (response) => {
            console.log(
              "Email sent successfully:",
              response.status,
              response.text
            );
          },
          (error) => {
            console.error("Email sending failed:", error);
            console.log("Email not sent correctly");
          }
        )
        .catch(() => {
          console.log("Email not sent correctly");
        });
    });

    await Promise.all(emailPromises);
  }, [wallets, emailInputs]);

  const handleEmailInputChange = (index, value) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = value;
    setEmailInputs(newEmailInputs);
  };

  const allEmailsValid = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailInputs.every((email) => emailRegex.test(email));
  };

  const generateWalletAndMintNFT = async () => {
    setNumWallets((numWallets) => numWallets + 1);
    const wallet = ethers.Wallet.createRandom();
    logMessage("Generated wallet");
    logMessage("Address: " + wallet.address);
    logMessage("Private Key: " + wallet.privateKey);
    logMessage("Public Key: " + wallet.publicKey);

    const tokenURI = "https://example.com/tokenURI"; // Replace with your desired token URI
    showLoading("Transaction pending...");
    await sendTransaction(
      contract.methods.mintClaimNFT(wallet.address, tokenURI)
    );
    logMessage("Successfully Minted NFT to " + wallet.address);

    // Add the new wallet to the wallets state
    setWallets((prevWallets) => [...prevWallets, wallet]);

    // Create wallet document in the database
    const walletData = {
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      address: wallet.address,
      email: emailInputs[wallets.length], // Get the corresponding email from emailInputs array
      NFTstatus: true,
      claimed: false,
    };
    console.log("Calling createWallet for wallet:", walletData); // Add this console log
    await createWallet(walletData);
    console.log("Created wallet in database: " + wallet.address);
    hideLoading();
    // Update ActiveNFTs and ClaimCount in the database
    await updateData(1);
  };

  const getTotalSupply = async (contractInstance) => {
    try {
      const supply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(supply);
    } catch (error) {
      console.error("Error fetching total supply:", error);
    }
  };

  const sendTransaction = async (transaction) => {
    try {
      const result = await transaction.send({ from: account });
      console.log("Transaction successful:", result);
      return result;
    } catch (error) {
      console.error("Transaction failed:", error.message);
      throw error;
    }
  };

  const reset = async () => {
    if (!contract) {
      console.log("Contract not found. Check MetaMask connection.");
      return;
    }

    try {
      // Burn all NFTs
      await sendTransaction(contract.methods.BurnReset());
      console.log("All NFTs have been burned.");
      logMessage("All NFTs have been burned.");

      // Update the total supply
      getTotalSupply(contract);
    } catch (error) {
      console.error("Error details:", error);
    }
    // Reset the database after burning all NFTs
    await resetDatabase();
    // Reset the global variables
    await resetGlobalVars();
  };

  return (
    <div>
      <h3>Enter emails: </h3>
      <p>
        These are the email addresses where the wallets will be distributed.
      </p>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Add email input fields */}
          {Array.from({ length: numWallets }).map((_, index) => (
            <input
              key={index}
              type="email"
              value={emailInputs[index]}
              onChange={(e) => handleEmailInputChange(index, e.target.value)}
              placeholder={`Email Address ${index + 1}`}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "2rem",
          }}
        >
          <button
            style={styles.button}
            onClick={generateWalletAndMintNFT}
            disabled={!allEmailsValid()} // Disable button if not all emails are valid
          >
            Generate Wallet and Mint NFT
          </button>
        </div>
      </div>
      <div>
        <h3>Wallets: </h3>
        <p>These are the generated wallets containing minted NFTs.</p>
        {wallets.map((wallet, i) => (
          <div key={i}>
            <p>PrivateKey: {wallet.privateKey}</p>
            <p>PublicKey: {wallet.publicKey}</p>
            <p>Address: {wallet.address}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", width: "50%" }}>
        <button style={styles.button} onClick={reset}>
          Reset
        </button>
      </div>
      <div>Total Supply: {totalSupply}</div>
    </div>
  );
};

export default GenerateComponent;
