const GlobalVars = require('./models/globalVars');// eslint-disable-line no-undef
// Function to update ActiveWalletCount
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

module.exports = {
  updateActiveWalletCount,
  updateClaimedNFTCount,
  updateActiveNFTCount
};