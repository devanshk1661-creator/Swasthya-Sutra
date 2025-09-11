// 1. Import libraries
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const pdf = require('html-pdf');

// 2. Create the server app
const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// 3. Configure the database connection for both local and deployed environments
const dbClient = new Client({
    connectionString: process.env.DATABASE_URL, // This is for Render
    ssl: {
        rejectUnauthorized: false // Required for Render's free tier
    },
    // --- Local development settings (if DATABASE_URL is not set) ---
    user: 'postgres',
    host: 'localhost',
    database: 'swasthyasutra',
    password: 'DKv16100@#', // <-- IMPORTANT: REPLACE WITH YOUR REAL PASSWORD
    port: 5432,
});
// Use local settings only if the DATABASE_URL is not provided by the cloud service
if (!process.env.DATABASE_URL) {
    delete dbClient.connectionObject.ssl;
    delete dbClient.connectionObject.connectionString;
}
dbClient.connect();


// 4. API Routes (All your existing routes)
// ... (Your app.get, app.post routes for patients, foods, etc. go here) ...

// API Endpoint to get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const allPatientsQuery = `SELECT * FROM patients;`;
        const result = await dbClient.query(allPatientsQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ... add all your other endpoints here ...


// 5. Start the server
app.listen(port, () => {
    console.log(`✅ Server is running successfully on port ${port}`);
});