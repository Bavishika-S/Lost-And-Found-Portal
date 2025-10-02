const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const claimRoutes = require('./routes/claims');

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// --- MONGODB ATLAS CONNECTION ---
// If process.env.MONGO_URI is undefined, it defaults to the local connection!
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/databaself';
const PORT = process.env.PORT || 4000;

const DB_NAME = 'databaself'; 

// **********************************************
// *** CRITICAL DIAGNOSTIC LINE ADDED HERE! ***
// **********************************************
console.log("APP IS USING URI:", MONGO_URI); 

mongoose.connect(MONGO_URI, { 
    // This option forces the database name to be 'databaself'
    dbName: DB_NAME 
})
  .then(() => {
    console.log(`✅ MongoDB Atlas connected successfully to database: ${DB_NAME}`);

    // Start server AFTER DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 API server listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// --- ROUTES ---
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/claims', claimRoutes);

// --- ERROR HANDLER ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});