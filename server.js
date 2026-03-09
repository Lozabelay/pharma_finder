// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const medicineRoutes = require('./routes/medicineRoutes');
const authRoutes = require('./routes/authRoutes'); // <--- Import the routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use Routes

app.use('/api/auth', require('./routes/authRoutes'));
// ... existing code ...


// ... existing middleware ...
app.use('/api/medicines', medicineRoutes);

// ... server listen ...

// Test DB Route (you can keep this or delete it)
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, result: rows[0].solution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});