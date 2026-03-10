const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/authMiddleware'); // 1. Import the Bouncer

// 2. Add 'verifyToken' as the second argument
// Now, this route requires a valid token to access
router.post('/add', verifyToken, medicineController.addMedicine);

// This route remains public (anyone can view)
router.get('/', medicineController.getMedicines);

module.exports = router;