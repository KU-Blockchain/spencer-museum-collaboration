import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ClaimNFTABI from '../ABI/ClaimNFT.json';

const ClaimNFTComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);

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
      const contractInstance = new web3Instance.eth.Contract(ClaimNFTABI.abi, '0x18882075d782cc9e571a47a3e9846dad97fe51d3');
      setContract(contractInstance);

      // Fetch total supply of NFTs
      getTotalSupply(contractInstance);
    };
    connectMetamask();
  }, []);

  const getTotalSupply = async (contractInstance) => {
    try {
      const supply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(supply);
    } catch (error) {
      console.error('Error fetching total supply:', error);
    }
  };


  const burnAll = async () => {
    if (!contract) {
      console.log('Contract not found. Check MetaMask connection.');
      return;
    }

    try {
      // Burn all NFTs
      const result = await contract.methods.BurnReset().send({ from: account });

      console.log('Transaction successful:', result);

      // Update the total supply
      getTotalSupply(contract);
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

  return (
    <div>
      <button onClick={mintNFT}>Mint</button>
      <button onClick={claimLand}>Claim</button>
      <button onClick={burnAll}>Burn All</button>
      <p>Total Supply: {totalSupply}</p>
    </div>
  );
};

export default ClaimNFTComponent;
