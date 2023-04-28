const GlobalVars = require('./models/globalVars');// eslint-disable-line no-undef
const Wallet = require('./models/wallet');// Function to update ActiveWalletCount
async function updateActiveWalletCount(delta) {
  try {
    const globalVars = await GlobalVars.findOne();
    globalVars.ActiveWalletCount += delta;
    await globalVars.save();
  } catch (error) {
    console.error("Error updating ActiveWalletCount:", error);
  }
}

async function updateClaimedNFTCount(delta) {
  try {
    const globalVars = await GlobalVars.findOne();
    globalVars.ClaimedNFTCount += delta;
    await globalVars.save();
  } catch (error) {
    console.error("Error updating ClaimedNFTCount:", error);
  }
}

async function updateActiveNFTCount(delta) {
  try {
    const globalVars = await GlobalVars.findOne();
    globalVars.ActiveNFTCount += delta;
    await globalVars.save();
  } catch (error) {
    console.error("Error updating ActiveNFTCount:", error);
  }
}

async function getInitialWalletsWithCircleData() {
  const wallets = await Wallet.find();
  return wallets.map((wallet) => {
    return {
      _id: wallet._id,
      address: wallet.address,
      claimed: false,
    };
  });
}
/*
async function getWalletsWithCircleData() {
  const wallets = await Wallet.find();
  return wallets.map((wallet) => {
    return {
      _id: wallet._id,
      address: wallet.address,
      color: wallet.claimed === true ? "#F9C2FF" : "#BFEFFF",
    };
  });
}
*/
module.exports = {
  updateActiveWalletCount,
  updateClaimedNFTCount,
  updateActiveNFTCount,
  getInitialWalletsWithCircleData
};