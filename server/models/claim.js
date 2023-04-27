// models/wallet.js
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    walletAddress: String,
    timestamp: String,
});

module.exports = mongoose.model('Claim', claimSchema);
