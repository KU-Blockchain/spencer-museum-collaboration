import React, { useState, useCallback, useEffect } from "react";
import Web3 from "web3";
import ClaimNFTABI from "../ABI/ClaimNFT.json";
import emailjs from "emailjs-com"; // Import emailjs
import { ethers } from "ethers";


const GenerateComponent = ({ styles, logMessage, sendtoApp }) => {
  // eslint-disable-next-line no-unused-vars
  const [numWallets, setNumWallets] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pending, setPending] = useState(false); // New state for tracking pending status
  const [wallets, setWallets] = useState([]);
  const [emailInputs, setEmailInputs] = useState(Array(numWallets).fill(""));
  

  // Add your EmailJS credentials here
  const emailjsUserId = "JMcPDIEBGca8QqOIV";
  const emailjsTemplateId = "template_qwekk94";
  const emailjsServiceId = "service_js0tfmo";

  useEffect(() => {
    const connectMetamask = async () => {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.log("MetaMask is not installed.");
    
        return;
      }

      // Connect MetaMask and enable accounts
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWeb3(web3Instance);
      setAccount(accounts[0]);

      // Set up the contract
      const contractInstance = new web3Instance.eth.Contract(
        ClaimNFTABI.abi,
        "0xf43b8348111bd93509b14ff718d3cc17ab0fb62f"
      );
      setContract(contractInstance);

      // Fetch total supply of NFTs
      getTotalSupply(contractInstance);
    };
    connectMetamask();
  }, []);

  //updates the total supply without having to refresh the page
  useEffect(() => {
    if (contract) {
      getTotalSupply(contract);
    }
  }, [contract]);

  // New function to send emails
  const sendEmails = useCallback(async () => {
    console.log("wallets length in send emails: " + wallets.length);
    
    const emailPromises = wallets.map((wallet, index) => {
      const emailData = {
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
          }
        );
    });
  
    await Promise.all(emailPromises);
  }, [wallets, emailInputs]);

  /*
  useEffect(() => {
    if (wallets.length > 0) {
      (async () => {
        await sendEmails();
        console.log("Emails sent successfully");
        logMessage("Emails sent successfully");
      })();
    }
  }, [wallets, logMessage, sendEmails]);
  */

  // New function to update email inputs
  const handleEmailInputChange = (index, value) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = value;
    setEmailInputs(newEmailInputs);
  };

  // New function to check if all email addresses are valid
  const allEmailsValid = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailInputs.every((email) => emailRegex.test(email));
  };

  
  

  const generateWalletsAndSendEmails = async () => {
    setNumWallets(numWallets=>numWallets+1)
    
    await generateWallets(async () => {
      await sendEmails();
      console.log("Emails sent successfully");
      logMessage("Emails sent successfully");
    });
    console.log("Wallets generated successfully");
    sendtoApp(wallets.length)
    logMessage("Wallets generated successfully");
  };
  
  

  // New function to generate a variable number of Ethereum wallets
  // New function to generate a variable number of Ethereum wallets
const generateWallets = async (callback) => {
  const wallets = [];

  for (let i = 0; i < numWallets; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      address: wallet.address,
    });
    logMessage("Generated wallet " + (i + 1) + " of " + numWallets);
    logMessage("Address: " + wallet.address);
    logMessage("Private Key: " + wallet.privateKey);
    logMessage("Public Key: " + wallet.publicKey);
  }

  setWallets(wallets);

  callback();
  
};

  
  
  // New function to mint NFTs into the generated paper wallets
  const mintNFTs = async () => {
    if (!contract || wallets.length === 0) {
      console.log(
        "Contract not found or no wallets available. Check MetaMask connection or generate wallets first."
      );
      return;
    }

    try {
      console.log("wallets length: " + wallets.length);
      for (const wallet of wallets) {
        const tokenURI = "https://example.com/tokenURI"; // Replace with your desired token URI
        await sendTransaction(
          contract.methods.mintClaimNFT(wallet.address, tokenURI)
        );
        console.log("Minted NFT to " + wallet.address);
        logMessage("Successfully Minted NFT to " + wallet.address );
      }
      console.log("NFTs minted successfully");
    } catch (error) {
      console.error("Transaction failed:", error.message);
    }
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
    setPending(true);
    try {
      const result = await transaction.send({ from: account });
      console.log("Transaction successful:", result);
      setPending(false);
      return result;
    } catch (error) {
      console.error("Transaction failed:", error.message);
      setPending(false);
      throw error;
    }
  };

  const burnAll = async () => {
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
  };

  

  return (
    <div>
      
      <h3>Enter emails: </h3>
      <p>These are the email addresses where the wallets will be distributed.</p>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '2rem',
          }}
        >
          <button
            style={styles.button}
            onClick={generateWalletsAndSendEmails}
            disabled={!allEmailsValid()} // Disable button if not all emails are valid
          >
            Generate Wallet
          </button>
        </div>
      </div>
      <div>
        <h3>Wallets: </h3>
        <p>Click the Mint NFTs button below to Mint an NFT into each wallet that has been created. </p>
        {wallets.map((wallet, i) => (
          <div key={i}>
            <p>PrivateKey: {wallet.privateKey}</p>
            <p>PublicKey: {wallet.publicKey}</p>
            <p>Address: {wallet.address}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex',  width: '50%'}}>
        <button style={styles.button} onClick={mintNFTs}>
          Mint NFTs
        </button>
        <button style={styles.button} onClick={burnAll}>
          Burn All
        </button>
      </div>
      <div>Total Supply: {totalSupply}</div>
    </div>
  );
  
};

export default GenerateComponent;
