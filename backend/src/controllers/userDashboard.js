const Submission = require('../models/submission');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const submissions = await Submission.find({
      userId,
      createdAt: { $gte: oneYearAgo }
    }).sort({ createdAt: -1 });

    // Calculate Streak
    let streak = 0;
    let lastDate = null;
    const uniqueDates = [...new Set(submissions.map(sub => new Date(sub.createdAt).toDateString()))];
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (uniqueDates.includes(today) || uniqueDates.includes(yesterdayStr)) {
        let currentDate = new Date(uniqueDates[0]);
        for (let i = 0; i < uniqueDates.length; i++) {
            const date = new Date(uniqueDates[i]);
            const diffTime = Math.abs(currentDate - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (i === 0 || diffDays === 1) {
                streak++;
                currentDate = date;
            } else {
                break;
            }
        }
    }

    // Heatmap Calculation
    const heatmapMap = {};
    submissions.forEach(sub => {
        const d = new Date(sub.createdAt).toISOString().split('T')[0];
        heatmapMap[d] = (heatmapMap[d] || 0) + 1;
    });
    
    // Transform to array
    const heatmap = Object.keys(heatmapMap).map(date => ({
        date,
        count: heatmapMap[date]
    }));

    res.status(200).json({ streak, heatmap });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const User = require('../models/user');

const toggleBookmark = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const isBookmarked = user.bookmarkedProblems.includes(problemId);
    
    if (isBookmarked) {
      user.bookmarkedProblems.pull(problemId);
    } else {
      user.bookmarkedProblems.push(problemId);
    }

    await user.save();
    res.status(200).json({ bookmarked: !isBookmarked, bookmarkedProblems: user.bookmarkedProblems });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getBookmarkedProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: 'bookmarkedProblems',
      select: '_id title difficulty tags acceptanceRate frequency status problemNumber'
    });
    
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user.bookmarkedProblems);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { getDashboardStats, toggleBookmark, getBookmarkedProblems };
