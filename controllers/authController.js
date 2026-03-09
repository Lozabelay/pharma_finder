const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER (Sign Up)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        // 2. Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 3. Hash the password (Encrypt it)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save user to database
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, email, hashedPassword, role || 'pharmacist']);

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// LOGIN (We will do this next)
exports.login = async (req, res) => {
    // Login logic will go here in the next step
    res.json({ message: 'Login endpoint ready' });
};