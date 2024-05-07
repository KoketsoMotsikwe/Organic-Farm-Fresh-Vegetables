const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://kokie1992:1992@Khumo@atlascluster.26p1wil.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const validationSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["firstname", "email", "address", "city", "state", "zip", "cardtype", "nameoncard", "cardnumber", "expmonth", "expyear", "cvv"],
        properties: {
            firstname: {
                bsonType: "string",
                minLength: 1
            },
            email: {
                bsonType: "string",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            address: {
                bsonType: "string",
                minLength: 1
            },
            city: {
                bsonType: "string",
                minLength: 1
            },
            state: {
                bsonType: "string",
                minLength: 1
            },
            zip: {
                bsonType: "string",
                pattern: "^[0-9]{5}$"
            },
            cardtype: {
                enum: ["Visa", "Mastercard"]
            },
            nameoncard: {
                bsonType: "string",
                minLength: 1
            },
            cardnumber: {
                bsonType: "string",
                pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$"
            },
            expmonth: {
                bsonType: "string",
                minLength: 1
            },
            expyear: {
                bsonType: "string",
                pattern: "^[0-9]{4}$"
            },
            cvv: {
                bsonType: "string",
                pattern: "^[0-9]{3}$"
            },
            sameadr: {
                bsonType: "bool"
            }
        }
    }
};

async function main() {
    try {
        await client.connect();

        const db = client.db("FarmFresh");
        
        // Modify the existing collection to apply validation schema
        await db.command({
            collMod: "FarmFresh",
            validator: validationSchema.$jsonSchema
        });

        console.log("Validation schema applied to collection 'FarmFresh'.");

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
