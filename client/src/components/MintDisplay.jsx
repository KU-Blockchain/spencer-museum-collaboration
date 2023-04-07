import { ethers } from "ethers";


const MintDisplay = ({styles}) => {
  /*
  Here, we're importing the GenerateWallets ABI from the GenerateWallets.json file, 
  initializing a new ethers.Contract instance with the contractAddress, 
  generateWalletsABI.abi, and provider objects, which represent the 
  contract address, ABI, and provider URL, respectively.

  Note that the provider object represents the Ethereum network 
  that you're connecting to, and can be changed to point to a different network if necessary.
  */
/*
  const generateWalletsABI = require("../ABI/GenerateWallets.json");
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  const contractAddress = "0x1234567890123456789012345678901234567890";

  const generateWallets = new ethers.Contract(
    contractAddress,
    generateWalletsABI.abi,
    provider
  );
*/
  return (
    <>
      <div style={styles.section}>
        <h2 style={styles.title}>Assign</h2>
        <button style={styles.button}>Mint</button>
      </div>
    </>
  );
}

export default MintDisplay;
