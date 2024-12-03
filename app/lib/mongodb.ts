import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Yosri1:Yosrizayani1@cluster0.m0p5c.mongodb.net/";
const client = new MongoClient(uri);
let isConnected = false; // Track the connection state

export async function connectToDatabase() {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true; // Set to true after successful connection
      console.log("Connected to MongoDB");
    }
    return client.db("SalesData"); // Return the desired database
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error; // Re-throw the error to handle it further up
  }
}
