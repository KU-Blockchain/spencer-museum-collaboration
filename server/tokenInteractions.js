const Web3 = require("web3");
const privateKey = process.env.PRIVATE_KEY;
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/OXZS1fOB3e1mTBT0o8_1W3T1FA6rIFTW'); // Polygon Mumbai RPC URL
const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);

const claimNFTAddress = '0x5104c25aa45c48774ea1f540913c8fdefe386606';
const {
    abi: claimNFTABI,
 
  } = require("./ABI/ClaimNFT.json");
  const {
    abi: ownershipNFTABI,
    address: ownershipNFTAddress,
  } = require("./ABI/OwnershipNFT.json");
  const {
    abi: fractionalOwnNFTABI,
    address: fractionalOwnNFTAddress,
  } = require("./ABI/FractionalOwnNFT.json");

const claimContract = new web3.eth.Contract(claimNFTABI, claimNFTAddress);
claimContract.options.from = wallet.address;

const mintClaimNFT = async (userAddress, tokenURI) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(wallet.address, "pending");
  
      const txData = claimContract.methods.mintClaimNFT(userAddress, tokenURI).encodeABI();
  
      const transaction = {
        from: wallet.address,
        to: claimNFTAddress,
        gas: await claimContract.methods.mintClaimNFT(userAddress, tokenURI).estimateGas({ from: wallet.address }),
        gasPrice: gasPrice,
        nonce: nonce,
        data: txData,
      };
  
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
      return receipt;
    } catch (error) {
      console.error("Error in mintClaimNFT:", error);
      throw error;
    }
  };
  

  const burnAllClaimNFTs = async () => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(wallet.address, "pending");
  
      const txData = claimContract.methods.BurnReset().encodeABI();
  
      const transaction = {
        from: wallet.address,
        to: claimNFTAddress,
        gas: await claimContract.methods.BurnReset().estimateGas({ from: wallet.address }),
        gasPrice: gasPrice,
        nonce: nonce,
        data: txData,
      };
  
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
      return receipt;
    } catch (error) {
      console.error("Error in burnAllClaimNFTs:", error);
      throw error;
    }
  };
  
  const burnSpecificClaimNFTs = async (walletAddresses) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(wallet.address, "pending");
  
      const txData = claimContract.methods.burnSpecificNFTs(walletAddresses).encodeABI();
  
      const transaction = {
        from: wallet.address,
        to: claimNFTAddress,
        gas: await claimContract.methods.burnSpecificNFTs(walletAddresses).estimateGas({ from: wallet.address }),
        gasPrice: gasPrice,
        nonce: nonce,
        data: txData,
      };
  
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
      return receipt;
    } catch (error) {
      console.error("Error in burnSpecificClaimNFTs:", error);
      throw error;
    }
  };
  

module.exports = {
  mintClaimNFT,
  burnAllClaimNFTs,
  burnSpecificClaimNFTs
};
