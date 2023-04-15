import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GenerateWalletsABI from '../ABI/GenerateWallets.json';
import ClaimNFTABI from '../ABI/ClaimNFT.json';
import ClaimNFTManagerABI from '../ABI/ClaimNFTManager.json';
import { ethers } from 'ethers';

const ClaimNFTComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [pending, setPending] = useState(false); // New state for tracking pending status
  // New state variables for GenerateWallets and ClaimNFTManager contracts
  const [generateWalletsContract, setGenerateWalletsContract] = useState(null);
  const [claimNFTManagerContract, setClaimNFTManagerContract] = useState(null);
   // New state variable for storing wallet information
   const [wallets, setWallets] = useState([]);
   const [numWallets, setNumWallets] = useState(5);


  useEffect(() => {
    const connectMetamask = async () => {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.log('MetaMask is not installed.');
        return;
      }

      // Connect MetaMask and enable accounts
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWeb3(web3Instance);
      setAccount(accounts[0]);

      // Set up the contract
      const contractInstance = new web3Instance.eth.Contract(ClaimNFTABI.abi, '0xd6f725ea2625ac557d2704054b2a4c6cd1fb99b6');
      setContract(contractInstance);

      // Fetch total supply of NFTs
      getTotalSupply(contractInstance);
    };
    connectMetamask();
  }, []);

  useEffect(() => {
    if (web3) {
      // Set up the GenerateWallets and ClaimNFTManager contracts
      const generateWalletsContractInstance = new web3.eth.Contract(GenerateWalletsABI.abi, '0xe3f268b0fc5a5deaf76c06c815e0a70b061e013d');
      setGenerateWalletsContract(generateWalletsContractInstance);

      const claimNFTManagerContractInstance = new web3.eth.Contract(ClaimNFTManagerABI.abi, '0x217f929dae78a489f9a0642943b0ff637dce0dbd');
      setClaimNFTManagerContract(claimNFTManagerContractInstance);
    }
  }, [web3]);

  //updates the total supply without having to refresh the page
  useEffect(() => {
    if (contract) {
      getTotalSupply(contract);
    }
  }, [contract]);

  // New function to generate a variable number of Ethereum wallets
  const generateWallets = async () => {
    const wallets = [];

    for (let i = 0; i < numWallets; i++) {
      const wallet = ethers.Wallet.createRandom();
      wallets.push({
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        address: wallet.address,
      });
    }

    setWallets(wallets);
  };
  // New function to mint NFTs into the generated paper wallets
  const mintNFTs = async () => {
    if (!contract || wallets.length === 0) {
      console.log('Contract not found or no wallets available. Check MetaMask connection or generate wallets first.');
      return;
    }

    try {
      for (const wallet of wallets) {
        const tokenURI = "https://example.com/tokenURI"; // Replace with your desired token URI
        await sendTransaction(contract.methods.mintClaimNFT(wallet.address, tokenURI));
      }
      console.log('NFTs minted successfully');
    } catch (error) {
      console.error('Transaction failed:', error.message);
    }
  };

  const getTotalSupply = async (contractInstance) => {
    try {
      const supply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(supply);
    } catch (error) {
      console.error('Error fetching total supply:', error);
    }
  };

  const sendTransaction = async (transaction) => {
    setPending(true);
    try {
      const result = await transaction.send({ from: account });
      console.log('Transaction successful:', result);
      setPending(false);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error.message);
      setPending(false);
      throw error;
    }
  };


  const burnAll = async () => {
    if (!contract) {
      console.log('Contract not found. Check MetaMask connection.');
      return;
    }

    try {
      // Burn all NFTs
      await sendTransaction(contract.methods.BurnReset());
      console.log('All NFTs have been burned.');

      // Update the total supply
      getTotalSupply(contract);
    } catch (error) {
      console.error('Error details:', error);
    }
  };


  const claimLand = async () => {
    if (!contract) {
      console.log('Contract not found. Check MetaMask connection.');
      return;
    }

    try {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(account, 0).call({ from: account });

      // Claim land by burning the NFT
      const result = await contract.methods.claimLand(tokenId).send({ from: account });

      console.log('Transaction successful:', result);
    } catch (error) {
      console.error('Transaction failed:', error.message);
    }
  };

  const hasClaimNFT = async () => {
    try {
      await contract.methods.tokenOfOwnerByIndex(account, 0).call({ from: account });
      return true;
    } catch (error) {
      return false;
    }
  };
  

// New function to generate wallets, mint NFTs, and send wallet information via email
const generateAndMint = async () => {
  const numWallets = 5;

  if (!claimNFTManagerContract || !generateWalletsContract) {
    console.log('Contracts not found. Check MetaMask connection.');
    return;
  }
  console.log("point 1");

  try {
    // Generate wallets and mint NFTs
    console.log("point 2");
    await sendTransaction(claimNFTManagerContract.methods.generateAndMint(numWallets));
    console.log("point 3");
    // Get the wallets
    const walletData = await generateWalletsContract.methods.getWallets().call({ from: account });
    const privateKeys = walletData[0];
    const publicKeys = walletData[1];

    // Update the wallets state
    setWallets(
      privateKeys.map((privateKey, i) => ({
        privateKey: privateKey,
        publicKey: publicKeys[i],
      }))
    );
    console.log("wallets: ", wallets);
    // Send wallet information via email and print them to the screen
    wallets.forEach((wallet) => {
      // Use your email sending logic here
      console.log(`Send email to: dummy@example.com\nPrivateKey: ${wallet.privateKey}\nPublicKey: ${wallet.publicKey}`);
    });
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
};

return (
  <div>
    <button onClick={generateWallets}>Generate Wallets</button>
    <button onClick={mintNFTs}>Mint NFTs</button>
    <button onClick={burnAll}>Burn All</button>
          <div>Total Supply: {totalSupply}</div>
    <div>
      <h2>Wallets</h2>
      {wallets.map((wallet, i) => (
        <div key={i}>
          <p>PrivateKey: {wallet.privateKey}</p>
          <p>PublicKey: {wallet.publicKey}</p>
          <p>Address: {wallet.address}</p>
        </div>
      ))}
    </div>
  </div>
);
};

export default ClaimNFTComponent;

