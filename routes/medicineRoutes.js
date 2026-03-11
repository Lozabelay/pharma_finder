const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.get('/search', medicineController.searchMedicines);
router.get('/', medicineController.getMedicines);

// --- PROTECTED ROUTES (Pharmacy Admin) ---
router.post('/add', verifyToken, medicineController.addMedicine);
router.get('/my-inventory', verifyToken, medicineController.getMyMedicines);
router.put('/update/:id', verifyToken, medicineController.updateMedicine);
// ... existing imports and routes ...

// --- PROTECTED ROUTES (Pharmacy Admin) ---
router.post('/add', verifyToken, medicineController.addMedicine);
router.get('/my-inventory', verifyToken, medicineController.getMyMedicines);
router.put('/update/:id', verifyToken, medicineController.updateMedicine);

// NEW: Delete Route
router.delete('/delete/:id', verifyToken, medicineController.deleteMedicine);

module.exports = router;

module.exports = router;