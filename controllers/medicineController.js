const db = require('../config/db');

// 1. Add a new medicine (Protected)
exports.addMedicine = async (req, res) => {
    try {
        // Security: Only logged in users can add
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not logged in' });
        }

        const { name, brand, description, price, stock_quantity, expiry_date } = req.body;
        
        // We get the pharmacy_id from the logged-in user's token data!
        const pharmacy_id = req.user.pharmacy_id; 

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        // Insert with pharmacy_id
        const query = 'INSERT INTO medicines (name, brand, description, price, stock_quantity, expiry_date, pharmacy_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        const [result] = await db.query(query, [name, brand, description, price, stock_quantity, expiry_date, pharmacy_id]);

        res.status(201).json({
            success: true,
            message: 'Medicine added successfully',
            data: { id: result.insertId, name, price, pharmacy_id }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 2. Get All Medicines (Public)
exports.getMedicines = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM medicines');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 3. Search Medicines (For Patients & Map)
exports.searchMedicines = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Please provide a medicine name' });
        }

        // UPDATED: Added latitude and longitude for the map feature
        const query = `
            SELECT medicines.name, medicines.price, medicines.stock_quantity, 
                   pharmacies.name as pharmacy_name, 
                   pharmacies.address,
                   pharmacies.latitude,
                   pharmacies.longitude
            FROM medicines 
            JOIN pharmacies ON medicines.pharmacy_id = pharmacies.id 
            WHERE medicines.name LIKE ?
            ORDER BY medicines.price ASC
        `;

        const [rows] = await db.query(query, [`%${name}%`]);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};