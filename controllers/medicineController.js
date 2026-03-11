const db = require('../config/db');

// 1. Add Medicine
exports.addMedicine = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Not logged in' });

        const { name, brand, description, price, stock_quantity, expiry_date } = req.body;
        const pharmacy_id = req.user.pharmacy_id; 

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        const query = 'INSERT INTO medicines (name, brand, description, price, stock_quantity, expiry_date, pharmacy_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, brand, description, price, stock_quantity, expiry_date, pharmacy_id]);

        res.status(201).json({ success: true, message: 'Medicine added successfully', data: { id: result.insertId, name, price } });
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

// 3. Search Medicines (Public - For Patients)
exports.searchMedicines = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ success: false, message: 'Please provide a medicine name' });

        const query = `
            SELECT medicines.name, medicines.price, medicines.stock_quantity, 
                   pharmacies.name as pharmacy_name, pharmacies.address,
                   pharmacies.latitude, pharmacies.longitude
            FROM medicines 
            JOIN pharmacies ON medicines.pharmacy_id = pharmacies.id 
            WHERE medicines.name LIKE ?
            ORDER BY medicines.price ASC
        `;
        const [rows] = await db.query(query, [`%${name}%`]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 4. Get My Inventory (Protected - For Pharmacy Admin)
exports.getMyMedicines = async (req, res) => {
    try {
        const pharmacy_id = req.user.pharmacy_id;
        if (!pharmacy_id) return res.status(400).json({ success: false, message: 'You are not associated with a pharmacy' });

        const [rows] = await db.query('SELECT * FROM medicines WHERE pharmacy_id = ?', [pharmacy_id]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 5. Update Medicine (Protected - For Pharmacy Admin)
exports.updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, stock_quantity } = req.body;
        const pharmacy_id = req.user.pharmacy_id;

        // Check ownership
        const [medicines] = await db.query('SELECT * FROM medicines WHERE id = ?', [id]);
        if (medicines.length === 0) return res.status(404).json({ success: false, message: 'Medicine not found' });
        if (medicines[0].pharmacy_id !== pharmacy_id) return res.status(403).json({ success: false, message: 'Not authorized' });

        // Update
        const query = 'UPDATE medicines SET price = ?, stock_quantity = ? WHERE id = ?';
        await db.query(query, [price, stock_quantity, id]);

        res.json({ success: true, message: 'Medicine updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}; 
// NOTE: The updateMedicine function ENDS here with the closing brace and semicolon.

// 6. Delete Medicine (Protected - For Pharmacy Admin)
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params; 
        const pharmacy_id = req.user.pharmacy_id; 

        // Security: Check ownership
        const [medicines] = await db.query('SELECT * FROM medicines WHERE id = ?', [id]);
        
        if (medicines.length === 0) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicines[0].pharmacy_id !== pharmacy_id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this medicine' });
        }

        // Delete from database
        await db.query('DELETE FROM medicines WHERE id = ?', [id]);

        res.json({ success: true, message: 'Medicine deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};