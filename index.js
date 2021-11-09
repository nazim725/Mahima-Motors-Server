const express = require('express')
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require('cors')

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Mahima-Motors");
        const userCollection = database.collection("users");


        // save user to database/ this function is used for register form
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

         // update user to database/ this function is used for google signing
         app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Mahima Motor Server is Running")
})

app.listen(port, () => {
    console.log("Running mahima motors Port:", port)
})