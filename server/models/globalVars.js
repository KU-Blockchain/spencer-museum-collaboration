// models/globalVars.js
const mongoose = require('mongoose');

const globalVarsSchema = new mongoose.Schema({
  ActiveNFTCount: Number,
  ActiveWalletCount: Number,
  ClaimedNFTCount: Number,
});

module.exports = mongoose.model('GlobalVars', globalVarsSchema);
