const db = require('../config/db'); // Import the database connection we made earlier

// Add a new medicine
exports.addMedicine = async (req, res) => {
    try {
        const { name, brand, description, price, stock_quantity, expiry_date, category_id, supplier_id } = req.body;

        // Basic validation
        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        // SQL Query to insert data
        const query = `
            INSERT INTO medicines (name, brand, description, price, stock_quantity, expiry_date, category_id, supplier_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.query(query, [
            name, brand, description, price, stock_quantity, expiry_date, category_id || null, supplier_id || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Medicine added successfully',
            data: { id: result.insertId, name, price }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get all medicines (Bonus)
exports.getMedicines = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM medicines');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};