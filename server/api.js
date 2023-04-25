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


module.exports = {
  updateActiveWalletCount,
};