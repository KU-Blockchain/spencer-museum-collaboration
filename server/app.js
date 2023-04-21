const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const dbPassword = process.env.DB_PASSWORD;

// Replace <password> with your actual password
const uri = "mongodb+srv://enasseri02:{password}@cluster0.uxmku1l.mongodb.net/myDatabase?retryWrites=true&w=majority";

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
