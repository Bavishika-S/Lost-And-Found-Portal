require('dotenv').config(); 
const { MongoClient } = require('mongodb');

// Get the URI from your environment file
const uri = process.env.MONGO_URI;
const DATABASE_NAME = 'databaself'; 

// --- DIAGNOSTIC: CHECK IF URI IS LOADED ---
if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing. Please ensure your .env file is present and formatted correctly.");
    process.exit(1);
}
console.log("✅ URI Loaded. Attempting connection to:", uri.substring(0, 50) + '...');
// ------------------------------------------

const client = new MongoClient(uri);

async function runTest() {
  try {
    // 1. Attempt to connect to the cluster
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas!");

    const database = client.db(DATABASE_NAME);
    const testCollection = database.collection('connectivityTest');

    // 2. The actual write operation
    const doc = { 
        message: "SUCCESSFUL Atlas Connectivity Test", 
        timestamp: new Date() 
    };
    
    const result = await testCollection.insertOne(doc);
    
    // 3. Confirm the write
    console.log(`✅ Document inserted into '${DATABASE_NAME}' database with _id: ${result.insertedId}`);
    
  } catch (e) {
    // 4. CRITICAL: DISPLAY THE ERROR
    console.error("❌ --- FAILED TO WRITE TO ATLAS ---");
    console.error("Error Details:", e.message);
    console.error("Check your IP Whitelist on MongoDB Atlas.");
    process.exit(1);
    
  } finally {
    // 5. Close the connection
    await client.close();
  }
}

runTest();