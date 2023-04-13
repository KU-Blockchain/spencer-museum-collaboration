import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ClaimNFTABI from '../ABI/ClaimNFT.json';

const ClaimNFTComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

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
      const contractInstance = new web3Instance.eth.Contract(ClaimNFTABI.abi, '0x9785ec078e0a83c1c9a50441122c7025568bde55');
      setContract(contractInstance);
    };
    connectMetamask();
  }, []);
  

  const mintNFT = async () => {
    if (!contract) {
      console.log('Contract not found. Check MetaMask connection.');
      return;
    }
  
    if (await hasClaimNFT()) {
      console.log('User already has a ClaimNFT. Cannot mint another one.');
      return;
    }
  
    try {
      // Mint the NFT
      const result = await contract.methods.mintClaimNFT(account, 'Spencer Museum').send({ from: account });
  
      console.log('Transaction successful:', result);
    } catch (error) {
      console.error('Transaction failed:', error.message);
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
  

  return (
    <div>
      <button onClick={mintNFT}>Mint</button>
      <button onClick={claimLand}>Claim</button>
    </div>
  );
};

export default ClaimNFTComponent;
