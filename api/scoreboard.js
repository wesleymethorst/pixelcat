import { MongoClient } from "mongodb";

// Haal de MongoDB-verbinding uit de Vercel Environment Variables
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
const dbName = "pixelcat";

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const scoresCollection = db.collection("scores");

        if (req.method === "GET") {
            // Haal de top 5 scores op, gesorteerd van hoog naar laag
            const scores = await scoresCollection.find().sort({ score: -1 }).limit(5).toArray();
            res.status(200).json(scores);
        }

        if (req.method === "POST") {
            const { name, score } = req.body;

            // Controleer of de naam en score geldig zijn
            if (!name || typeof name !== "string" || typeof score !== "number") {
                res.status(400).json({ error: "Ongeldige invoer: naam moet een string zijn en score een nummer." });
                return;
            }

            // Sla de naam en score op in de database
            await scoresCollection.insertOne({ name, score });
            res.status(201).json({ success: "Score opgeslagen!", name, score });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
}
