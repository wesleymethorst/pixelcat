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
    const data = await db.collection("scores").find({}).toArray();
    const formattedData = data.map(score => ({
      id: score._id,
      name: score.name,
      points: score.points
    }));
    res.status(200).json({ data: formattedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
