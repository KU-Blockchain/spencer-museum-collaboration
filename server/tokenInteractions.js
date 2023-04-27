const Web3 = require("web3");
const privateKey = process.env.PRIVATE_KEY;
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/OXZS1fOB3e1mTBT0o8_1W3T1FA6rIFTW'); // Polygon Mumbai RPC URL
const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
let currentNonce = null;

const transactionQueue = [];
let isProcessingQueue = false;

const getAndUpdateNonce = async () => {
  currentNonce = await web3.eth.getTransactionCount(wallet.address, "pending");
  return currentNonce;
};

const sendTransaction = async (transactionFunc, ...args) => {
  return new Promise(async (resolve, reject) => {
    transactionQueue.push({ transactionFunc, args, resolve, reject });

    if (!isProcessingQueue) {
      isProcessingQueue = true;
      while (transactionQueue.length > 0) {
        const { transactionFunc, args, resolve, reject } = transactionQueue.shift();
        try {
          const result = await transactionFunc(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
        await new Promise((r) => setTimeout(r, 500)); // Wait for half a second before processing the next transaction
      }
      isProcessingQueue = false;
    }
  });
};


const claimNFTAddress = '0x61d5f829407a425806d896ae7277f558f83fedc9';
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

const handleFundTransfer = async (req, res) => {
  try {
    const { tokenId, userAddress } = req.body;
    const privateKey = process.env.PRIVATE_KEY; // Replace this with the actual private key source
    await transferFunds(tokenId, userAddress, privateKey);
    res.status(200).json({ status: "success", transferredAmount: "amount_here" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const transferFunds = async (tokenId, userAddress, privateKey) => {
  try {
    const gasLimit = await claimContract.methods
      .claimLand(tokenId, userAddress)
      .estimateGas({ from: wallet.address });

    const gasPrice = await web3.eth.getGasPrice();

    const requiredMatic = web3.utils.toBN(gasLimit).mul(web3.utils.toBN(gasPrice));

    const bufferMultiplier = 1.1;
    const bufferedMatic = requiredMatic
      .mul(web3.utils.toBN(Math.round(bufferMultiplier * 2e18)))
      .div(web3.utils.toBN(1e18));

    const nonce = await getAndUpdateNonce();

    const transaction = {
      from: wallet.address,
      to: userAddress,
      value: web3.utils.toHex(bufferedMatic),
      gas: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(gasPrice),
      nonce: web3.utils.toHex(nonce),
    };

    const signedTransaction = await wallet.signTransaction(transaction);
    const receipt = await sendTransaction(
      web3.eth.sendSignedTransaction,
      signedTransaction.rawTransaction
    );
    return receipt;
  } catch (error) {
    console.error("Error transferring funds:", error);
    throw error;
  }
};

const getTokenIdByAddress = async (userAddress) => {
  try {
    const nonce = await getAndUpdateNonce();
    const tokenId = await claimContract.methods.addressToTokenId(userAddress).call();
    return tokenId;
  } catch (error) {
    console.error("Error in getTokenIdByAddress:", error);
    throw error;
  }
};

const mintClaimNFT = async (userAddress, tokenURI) => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await getAndUpdateNonce();

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
    const receipt = await sendTransaction(
      web3.eth.sendSignedTransaction,
      signedTransaction.rawTransaction
    );
    return receipt;
  } catch (error) {
    console.error("Error in mintClaimNFT:", error);
    throw error;
  }
};
  

  const burnAllClaimNFTs = async () => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await getAndUpdateNonce();
  
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
      const receipt = await sendTransaction(
        web3.eth.sendSignedTransaction,
        signedTransaction.rawTransaction
      );
      return receipt;
    } catch (error) {
      console.error("Error in burnAllClaimNFTs:", error);
      throw error;
    }
  };

  
  const burnSpecificClaimNFTs = async (walletAddresses) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
  
      const nonce = await getAndUpdateNonce();
  
      const txData = claimContract.methods.burnSpecificNFTs(walletAddresses).encodeABI();
  
      const transaction = {
        from: wallet.address,
        to: claimNFTAddress,
        gas: await claimContract.methods.burnSpecificNFTs(walletAddresses).estimateGas({ from: wallet.address }),
        gasPrice: gasPrice,
        nonce: nonce,
        data: txData,
      };
  
      // Added console logs
      console.log('walletAddresses:', walletAddresses);
      console.log('gasPrice:', gasPrice);
      console.log('nonce:', nonce);
      console.log('transaction:', transaction);
  
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await sendTransaction(
        web3.eth.sendSignedTransaction,
        signedTransaction.rawTransaction
      );
      console.log('signedTransaction:', signedTransaction);
  
      return receipt;
    } catch (error) {
      console.error("Error in burnSpecificClaimNFTs:", error);
      throw error;
    }
  };
  
  

  const executeClaim = async (tokenId, userAddress) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await getAndUpdateNonce();
  
      const txData = claimContract.methods
        .claimLand(tokenId, userAddress)
        .encodeABI();
  
      const transaction = {
        from: wallet.address,
        to: claimNFTAddress,
        gas: await claimContract.methods
          .claimLand(tokenId, userAddress)
          .estimateGas({ from: wallet.address }),
        gasPrice: gasPrice,
        nonce: nonce,
        data: txData,
      };
  
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await sendTransaction(
        web3.eth.sendSignedTransaction,
        signedTransaction.rawTransaction
      );
      return receipt;
    } catch (error) {
      console.error("Error in executeClaim:", error);
      throw error;
    }
  };
  

module.exports = {
  mintClaimNFT,
  burnAllClaimNFTs,
  burnSpecificClaimNFTs,
  executeClaim,
  handleFundTransfer,
  getTokenIdByAddress
};
