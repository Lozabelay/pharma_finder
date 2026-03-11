const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import Admin Routes

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/admin', adminRoutes); // Use Admin Routes

// Test DB Route
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, result: rows[0].solution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});