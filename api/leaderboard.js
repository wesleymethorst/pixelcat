// api/leaderboard.js
import { MongoClient } from 'mongodb';

// Zorg ervoor dat de environment variable MONGODB_URI op Vercel is ingesteld
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (!uri) {
    return res.status(500).json({ error: "MONGODB_URI is niet ingesteld" });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("pixelcat"); // vervang dit met de naam van je database
    const data = await db.collection("scores").find({}).toArray(); // vervang 'jouwCollectie' met de collectie die je wilt gebruiken
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
