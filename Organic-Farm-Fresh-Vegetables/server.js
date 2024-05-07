const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override'); // Import method override

const app = express();
const PORT = 3000;

const uri = "mongodb+srv://kokie1992:1992@Khumo@atlascluster.26p1wil.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(methodOverride('_method')); // Apply method override middleware

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

connectDB();

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Create a new document
app.post('/api/farmfresh', async (req, res) => {
    const newData = req.body;
    const db = client.db("FarmFresh");

    try {
        const result = await db.collection("FarmFresh").insertOne(newData);
        console.log("Document inserted:", result.ops[0]); // Logging the inserted document
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error("Error inserting document:", error);
        res.status(500).json({ message: "Error inserting document" });
    }
});

// Update an existing document
app.put('/api/farmfresh/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const db = client.db("FarmFresh");

    try {
        const result = await db.collection("FarmFresh").updateOne({ _id: ObjectId(id) }, { $set: updatedData });
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Document updated successfully" });
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Error updating document" });
    }
});

// Retrieve all documents
app.get('/api/farmfresh', async (req, res) => {
    const db = client.db("FarmFresh");

    try {
        const documents = await db.collection("FarmFresh").find().toArray();
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error retrieving documents:", error);
        res.status(500).json({ message: "Error retrieving documents" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
