const express = require("express");
const Web3 = require("web3");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
require("dotenv").config();
const {
  mintClaimNFT,
  burnAllClaimNFTs,
  burnSpecificClaimNFTs,
} = require("./tokenInteractions");

const PORT = process.env.PORT || 5001;
//const claimNFTAddress = '0x5104c25aa45c48774ea1f540913c8fdefe386606';
const {
  abi: claimNFTABI,
  address: claimNFTAddress,
} = require("./ABI/ClaimNFT.json");
const {
  abi: ownershipNFTABI,
  address: ownershipNFTAddress,
} = require("./ABI/OwnershipNFT.json");
const {
  abi: fractionalOwnNFTABI,
  address: fractionalOwnNFTAddress,
} = require("./ABI/FractionalOwnNFT.json");
const { updateActiveWalletCount } = require("./api");
const privateKey = process.env.PRIVATE_KEY;

const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const dbPassword = process.env.DB_PASSWORD;
const Wallet = require("./models/wallet");
const Claim = require("./models/claim");

// Replace <password> with your actual password
//const uri = `mongodb+srv://enasseri02:${dbPassword}@cluster0.uxmku1l.mongodb.net/myDatabase?retryWrites=true&w=majority`;
const uri =
  "mongodb+srv://enasseri02:IGpL1fmUGgS6YFhp@cluster0.uxmku1l.mongodb.net/myDatabase?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});

//app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000", // Or the URL of your client-side app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "my-custom-header"],
  credentials: true,
};

const io = require("socket.io")(server, {
  cors: corsOptions,
});
app.use(cors(corsOptions));

// Use the express.json middleware to parse incoming JSON data
app.use(express.json());

// Now that we have connected, start the express server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/mintClaimNFT", async (req, res) => {
  const { userAddress, tokenURI } = req.body;

  try {
    const receipt = await mintClaimNFT(userAddress, tokenURI);
    res.status(200).json(receipt);
  } catch (error) {
    console.error("Error in /mintClaimNFT:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/burnAllClaimNFTs", async (req, res) => {
  try {
    const receipt = await burnAllClaimNFTs();
    res.status(200).json(receipt);
  } catch (error) {
    console.error("Error in /burnAllClaimNFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/burnSpecificClaimNFTs", async (req, res) => {
  const { walletAddresses } = req.body;

  try {
    const receipt = await burnSpecificClaimNFTs(walletAddresses);
    res.status(200).json(receipt);
  } catch (error) {
    console.error("Error in /burnSpecificClaimNFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add this route below the existing routes
app.get("/claims", async (req, res) => {
  try {
    const claims = await Claim.find({});
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims", error });
  }
});

app.put("/updateActiveTokenCount", async (req, res) => {
  const { activeTokenCount } = req.body;

  try {
    const updatedGlobalVars = await updateActiveTokenCountInDatabase(
      activeTokenCount
    );
    res.status(200).json(updatedGlobalVars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating active token count", error });
  }
});
async function updateActiveTokenCountInDatabase(activeTokenCount) {
  const globalVars = await GlobalVars.findOne();
  if (!globalVars) {
    throw new Error("GlobalVars not found");
  }

  globalVars.ActiveNFTCount = activeTokenCount;
  await globalVars.save();

  return globalVars;
}
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url} | Request method: ${req.method}`);
  next();
});

// POST endpoint to create a new wallet
app.post("/wallets", async (req, res) => {
  console.log("Received POST request to /wallets"); // Add this console log
  const walletData = req.body;
  console.log("Wallet data received:", walletData); // Add this console log
  const wallet = new Wallet(walletData);
  try {
    await wallet.save();
    console.log("Wallet saved to database:", wallet); // Add this console log

    // Increment ActiveWalletCount
    await updateActiveWalletCount(1);
    res.status(201).json(wallet);
  } catch (err) {
    console.error("Error saving wallet:", err); // Add this console log
    res.status(500).send(err);
  }
});

// POST endpoint to save claim data
app.post("/claim", async (req, res) => {
  console.log("Received POST request to /claim");
  const claimData = req.body;
  console.log("Claim data received:", claimData);
  const claim = new Claim(claimData);
  try {
    await claim.save();
    // Emit an event to all connected clients
    io.emit("claimInitiated", claim.timestamp);
    console.log("Claim data saved to database:", claim);
    res.status(201).json(claim);
  } catch (err) {
    console.error("Error saving claim data:", err);
    res.status(500).send(err);
  }
});

// PUT endpoint to update ActiveNFTs and ClaimCount
app.put("/update", async (req, res) => {
  // Implement your logic for updating ActiveNFTs and ClaimCount
  // You may need to create a separate schema and model for storing these values.
});

// POST endpoint to reset the database
app.post("/reset", async (req, res) => {
  try {
    // Remove all wallets
    const result = await Wallet.deleteMany({});
    // Remove all claims
    const claimResult = await Claim.deleteMany({});

    await updateActiveWalletCount(-data.deletedCount);
    // Reset ActiveNFTs and ClaimCount
    // You may need to create a separate schema and model for storing these values.

    res.status(200).json({
      message: "Database reset successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const GlobalVars = require("./models/globalVars"); // Import the GlobalStats model

app.get("/globalVars", async (req, res) => {
  try {
    const globalVars = await GlobalVars.findOne({});
    console.log("globalVars:", globalVars); // Add this line
    res.status(200).json(globalVars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching global vars" });
  }
});

// Endpoint to update global stats
app.put("/globalVars", async (req, res) => {
  try {
    const { ActiveNFTCount, ActiveWalletCount, ClaimedNFTCount } = req.body;
    const globalVars = await GlobalVars.findOneAndUpdate(
      {},
      { ActiveNFTCount, ActiveWalletCount, ClaimedNFTCount },
      { new: true, upsert: true }
    );
    res.status(200).json(globalVars);
  } catch (error) {
    res.status(500).json({ message: "Error updating global vars" });
  }
});

// app.js
app.patch("/globalVars/incrementActiveWalletCount", async (req, res) => {
  try {
    const globalVars = await GlobalVars.findOne();
    if (!globalVars) {
      res.status(404).send("GlobalVars not found");
      return;
    }

    globalVars.ActiveWalletCount += 1;
    await globalVars.save();

    res.status(200).send(globalVars);
  } catch (error) {
    res
      .status(500)
      .send("Error incrementing ActiveWalletCount: " + error.message);
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Connect Mongoose to the MongoDB client
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Mongoose connected"))
      .catch((err) => console.log("Error connecting Mongoose:", err));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Don't close the client, as we want to keep it connected for the lifetime of the server
    // await client.close();
  }
}

run().catch(console.dir);
