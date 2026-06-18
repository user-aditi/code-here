const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { getDashboardStats, toggleBookmark, getBookmarkedProblems } = require('../controllers/userDashboard');

router.get('/stats', userMiddleware, getDashboardStats);
router.post('/bookmark/:problemId', userMiddleware, toggleBookmark);
router.get('/bookmarked', userMiddleware, getBookmarkedProblems);

module.exports = router;
