const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const { getOverview } = require('../controllers/adminAnalytics');
const { getStudents } = require('../controllers/adminController');

router.get('/overview', adminMiddleware, getOverview);
router.get('/students', adminMiddleware, getStudents);

module.exports = router;
