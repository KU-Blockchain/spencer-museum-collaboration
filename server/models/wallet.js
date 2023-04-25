// models/wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  address: String,
  publicKey: String,
  privateKey: String,
  email: String,
  NFTstatus: Boolean,
  claimed: Boolean,
});

module.exports = mongoose.model('Wallet', walletSchema);
