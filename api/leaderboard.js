import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db('pixelcat'); // Database naam
        const collection = db.collection('scores'); // Collectie voor de scores

        if (req.method === 'GET') {
            // Score ophalen (gesorteerd op hoogste score)
            const scores = await collection.find({}).sort({ score: -1 }).toArray();
            res.status(200).json(scores);
        } 
        
        else if (req.method === 'POST') {
            // Nieuwe score toevoegen
            const { naam, score } = JSON.parse(req.body);
            await collection.insertOne({ naam, score: parseInt(score) });
            res.status(201).json({ message: 'Score toegevoegd!' });
        } 
        
        else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    } finally {
        await client.close();
    }
}
