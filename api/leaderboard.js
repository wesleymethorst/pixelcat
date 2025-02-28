import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (!uri) {
    return res.status(500).json({ error: "MONGODB_URI is niet ingesteld" });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("pixelcat");

    if (req.method === 'POST') {
      const { naam, score } = req.body;
      const result = await db.collection("scores").insertOne({ naam, score });
      res.status(201).json({ message: "Score toegevoegd", result });
    } else {
      const data = await db.collection("scores").find({}).toArray();
      res.status(200).json({ scores: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
