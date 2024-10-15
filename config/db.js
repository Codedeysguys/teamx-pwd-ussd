const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

let client;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');
    }
    return client;
}

async function getDatabase() {
    const client = await connectToDatabase();
    return client.db('hack4PWD');
}

module.exports = { getDatabase };
