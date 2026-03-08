// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Register a new pharmacy
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // 1. Destructure data from request body
        const { name, email, password, address, phone } = req.body;

        // 2. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter name, email, and password' 
            });
        }

        // 3. Check if email already exists
        const [existingUsers] = await db.query('SELECT * FROM pharmacies WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // 4. Hash the password (Security!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Insert into Database
        const [result] = await db.query(
            'INSERT INTO pharmacies (name, email, password, address, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, phone]
        );

        // 6. Send Success Response
        res.status(201).json({
            success: true,
            message: 'Pharmacy registered successfully!',
            data: {
                id: result.insertId,
                name: name,
                email: email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
});

module.exports = router;