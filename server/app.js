const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
require('dotenv').config();
const cors = require('cors');

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const dbPassword = process.env.DB_PASSWORD;
const Wallet = require('./models/wallet');

// Replace <password> with your actual password
//const uri = `mongodb+srv://enasseri02:${dbPassword}@cluster0.uxmku1l.mongodb.net/myDatabase?retryWrites=true&w=majority`;
const uri = 'mongodb+srv://enasseri02:IGpL1fmUGgS6YFhp@cluster0.uxmku1l.mongodb.net/myDatabase?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
});

// Use the express.json middleware to parse incoming JSON data
app.use(express.json());
app.use(cors());

// POST endpoint to create a new wallet
app.post('/wallet', async (req, res) => {
  const walletData = req.body;
  const wallet = new Wallet(walletData);
  try {
    await wallet.save();
    res.status(201).send(wallet);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT endpoint to update ActiveNFTs and ClaimCount
app.put('/update', async (req, res) => {
  // Implement your logic for updating ActiveNFTs and ClaimCount
  // You may need to create a separate schema and model for storing these values.
});

// POST endpoint to reset the database
app.post('/reset', async (req, res) => {
  try {
    // Remove all wallets
    await Wallet.deleteMany({});

    // Reset ActiveNFTs and ClaimCount
    // You may need to create a separate schema and model for storing these values.

    res.status(200).send('Database reset successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

const GlobalVars = require('./models/globalVars'); // Import the GlobalStats model

// Endpoint to fetch global stats
app.get('/globalVars', async (req, res) => {
  try {
    const globalVars = await GlobalVars.findOne({});
    res.status(200).json(globalVars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching global vars' });
  }
});

// Endpoint to update global stats
app.put('/globalVars', async (req, res) => {
  try {
    const { ActiveNFTCount, ActiveWalletCount, ClaimedNFTCount } = req.body;
    const globalVars = await GlobalVars.findOneAndUpdate(
      {},
      { ActiveNFTCount, ActiveWalletCount, ClaimedNFTCount },
      { new: true, upsert: true }
    );
    res.status(200).json(globalVars);
  } catch (error) {
    res.status(500).json({ message: 'Error updating global vars' });
  }
});

// app.js
app.patch('/globalVars/incrementActiveWalletCount', async (req, res) => {
  try {
    const globalVars = await GlobalVars.findOne();
    if (!globalVars) {
      res.status(404).send('GlobalVars not found');
      return;
    }

    globalVars.ActiveWalletCount += 1;
    await globalVars.save();

    res.status(200).send(globalVars);
  } catch (error) {
    res.status(500).send('Error incrementing ActiveWalletCount: ' + error.message);
  }
});


async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Now that we have connected, start the express server
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Connect Mongoose to the MongoDB client
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Mongoose connected'))
    .catch((err) => console.log('Error connecting Mongoose:', err));

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Don't close the client, as we want to keep it connected for the lifetime of the server
    // await client.close();
  }
}

run().catch(console.dir);


