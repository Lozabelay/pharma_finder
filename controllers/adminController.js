const db = require('../config/db');

// 1. Create a new Pharmacy (Super Admin Only)
exports.createPharmacy = async (req, res) => {
    try {
        // SECURITY CHECK: Only allow 'admin' role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied. Super Admins only.' });
        }

        const { name, address, phone, latitude, longitude } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Pharmacy name is required' });
        }

        const query = 'INSERT INTO pharmacies (name, address, phone, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, address, phone, latitude || 0, longitude || 0]);

        res.status(201).json({
            success: true,
            message: 'Pharmacy created successfully',
            pharmacy_id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. Get All Pharmacies (Super Admin Only)
exports.getAllPharmacies = async (req, res) => {
    try {
        // SECURITY CHECK
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied. Super Admins only.' });
        }

        const [rows] = await db.query('SELECT * FROM pharmacies');
        res.json({ success: true, count: rows.length, data: rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 3. Get All Users (Super Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        // SECURITY CHECK
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied. Super Admins only.' });
        }

        // We select all users but hide the password for security
        const [rows] = await db.query('SELECT id, name, email, role, pharmacy_id, created_at FROM users');
        res.json({ success: true, count: rows.length, data: rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};