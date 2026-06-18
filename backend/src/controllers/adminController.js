const User = require('../models/user');

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'user' }).select('-password');
        
        // Return structured list
        const formattedStudents = students.map(student => ({
            id: student._id,
            name: student.firstName,
            email: student.emailId,
            role: student.role,
        }));

        res.status(200).json({
            success: true,
            students: formattedStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getStudents };
