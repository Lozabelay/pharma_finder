const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER (Sign Up)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, pharmacy_id } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let finalPharmacyId = null;
        if (role === 'pharmacy_admin' || role === 'pharmacy_owner') { // handling both just in case
            if (!pharmacy_id) {
                return res.status(400).json({ success: false, message: 'Pharmacy ID is required for pharmacy admins' });
            }
            finalPharmacyId = pharmacy_id;
        }

        const query = 'INSERT INTO users (name, email, password, role, pharmacy_id) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [name, email, hashedPassword, role || 'patient', finalPharmacyId]);

        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// LOGIN (Sign In)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, pharmacy_id: user.pharmacy_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                pharmacy_id: user.pharmacy_id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};