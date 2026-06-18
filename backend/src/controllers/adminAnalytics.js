const User = require('../models/user');
const Submission = require('../models/submission');
const Problem = require('../models/problem');

const getOverview = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'user' });
        
        // Active today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const uniqueUsersActiveToday = await Submission.distinct('userId', { createdAt: { $gte: startOfDay } });
        const activeToday = uniqueUsersActiveToday.length;

        const totalProblems = await Problem.countDocuments();
        const totalSubmissions = await Submission.countDocuments();

        // 7 days daily active users
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSubmissions = await Submission.find({ createdAt: { $gte: sevenDaysAgo } }).select('userId createdAt');
        
        const dailyActiveMap = {};
        const dailySubMap = {};
        
        recentSubmissions.forEach(sub => {
            const dateStr = new Date(sub.createdAt).toISOString().split('T')[0];
            if (!dailyActiveMap[dateStr]) dailyActiveMap[dateStr] = new Set();
            dailyActiveMap[dateStr].add(sub.userId.toString());
            
            dailySubMap[dateStr] = (dailySubMap[dateStr] || 0) + 1;
        });

        const dailyData = Object.keys(dailyActiveMap).map(date => ({
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            students: dailyActiveMap[date].size,
            submissions: dailySubMap[date] || 0
        }));

        res.status(200).json({
            totalStudents,
            activeToday,
            totalProblems,
            totalSubmissions,
            dailyData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

module.exports = { getOverview };
