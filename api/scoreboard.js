// api/leaderboard.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to your environment variables");
}

// Caching van de client in een serverless omgeving
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("pixelcat"); // Gebruik hier jouw database naam

  if (req.method === "GET") {
    // Haal het leaderboard op uit de 'scores'-collectie
    const leaderboard = await db.collection("scores").find({}).toArray();
    res.status(200).json({ leaderboard });
  } else if (req.method === "POST") {
    // Voeg een nieuwe score toe
    const { playerName, score } = req.body;
    if (!playerName || typeof score !== "number") {
      return res.status(400).json({ error: "Ongeldige data" });
    }
    const result = await db.collection("scores").insertOne({ playerName, score });
    res.status(201).json({ message: "Score toegevoegd", result });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
