const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Route: POST /api/medicines/add
router.post('/add', medicineController.addMedicine);

// Route: GET /api/medicines
router.get('/', medicineController.getMedicines);

module.exports = router;