const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/authMiddleware'); // 1. Import the Bouncer

// --- PUBLIC ROUTES (Anyone can access) ---

// 1. Search Medicines (For Patients) - We put this FIRST
router.get('/search', medicineController.searchMedicines);

// 2. Get All Medicines
router.get('/', medicineController.getMedicines);


// --- PROTECTED ROUTES (Must have Token) ---

// 3. Add Medicine (Only logged-in Pharmacy Admins)
router.post('/add', verifyToken, medicineController.addMedicine);

module.exports = router;