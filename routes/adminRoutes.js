const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

// All routes here are protected and require the user to be logged in
// We will add a check inside the controller to ensure role is 'admin'

router.post('/pharmacy', verifyToken, adminController.createPharmacy);
router.get('/pharmacies', verifyToken, adminController.getAllPharmacies);
router.get('/users', verifyToken, adminController.getAllUsers);

module.exports = router;