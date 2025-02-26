import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const dbName = "pixelcat"; // Zorg dat dit overeenkomt met je MongoDB Atlas database

let cachedClient = null; // Cache om herhaalde connecties te voorkomen

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout als MongoDB niet bereikbaar is
    });

    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    try {
        const client = await connectToDatabase();
        const db = client.db(dbName);
        const scoresCollection = db.collection("scores");

        if (req.method === "GET") {
            const scores = await scoresCollection.find().sort({ score: -1 }).limit(5).toArray();
            res.status(200).json(scores);
        } else if (req.method === "POST") {
            const { name, score } = req.body;

            if (!name || typeof name !== "string" || typeof score !== "number") {
                res.status(400).json({ error: "Naam moet een string zijn en score een nummer." });
                return;
            }

            await scoresCollection.insertOne({ name, score });
            res.status(201).json({ success: "Score opgeslagen!", name, score });
        } else {
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
        }
    } catch (error) {
        console.error("MongoDB fout:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
}
