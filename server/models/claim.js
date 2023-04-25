// models/wallet.js
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    walletAddress: String,
      timestamp: Number,
});

module.exports = mongoose.model('Claim', claimSchema);
