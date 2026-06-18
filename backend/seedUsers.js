require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user');
const Submission = require('./src/models/submission');
const Problem = require('./src/models/problem');
const main = require('./src/config/db');

const generateRandomSubmissions = async (userId, problems) => {
  if (problems.length === 0) return;
  const submissionsToCreate = [];
  
  // Decide how many problems this user solved (between 2 and 10)
  const numSolved = Math.floor(Math.random() * 8) + 2;
  const shuffledProblems = [...problems].sort(() => 0.5 - Math.random());
  const selectedProblems = shuffledProblems.slice(0, numSolved);
  const solvedProblemIds = [];

  for (const prob of selectedProblems) {
    // Generate 1 to 3 submissions per problem (to simulate failures before success)
    const attempts = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < attempts; i++) {
      const isSuccess = i === attempts - 1; // Last attempt is success
      const pastDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)); // Within last 30 days
      
      submissionsToCreate.push({
        userId,
        problemId: prob._id,
        code: "console.log('Hello World')",
        language: "javascript",
        status: isSuccess ? "accepted" : "wrong",
        createdAt: pastDate
      });

      if (isSuccess) {
        solvedProblemIds.push(prob._id);
      }
    }
  }

  await Submission.insertMany(submissionsToCreate);
  return solvedProblemIds;
};

async function seed() {
  try {
    await main();
    console.log("Connected to DB.");

    const protectEmails = ['aditi@hotmail.com', 'admin@example.com'];

    // 1. Delete all users except protected ones
    const usersToDelete = await User.find({ emailId: { $nin: protectEmails } });
    const userIdsToDelete = usersToDelete.map(u => u._id);

    console.log(`Deleting ${usersToDelete.length} existing test users...`);
    await User.deleteMany({ _id: { $in: userIdsToDelete } });

    // 2. Delete submissions of deleted users
    console.log(`Deleting their submissions...`);
    await Submission.deleteMany({ userId: { $in: userIdsToDelete } });

    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riya", "Aanya", "Ishita", "Ananya", "Diya", "Kavya", "Neha", "Rahul", "Priya"];
    const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Deshmukh", "Verma", "Jain", "Mehta", "Bose", "Nair", "Iyer", "Rao", "Das", "Yadav"];
    const classes = ["Batch 2024", "Batch 2025", "Batch 2026", "Batch 2027"];

    const hashedPassword = await bcrypt.hash('student123', 10);
    const allProblems = await Problem.find({});
    
    console.log("Generating 15 new diverse students...");

    for (let i = 0; i < 15; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const studentClass = classes[Math.floor(Math.random() * classes.length)];
      const rating = Math.floor(Math.random() * 800) + 1000; // 1000 - 1800
      
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;

      const newUser = await User.create({
        firstName: fName,
        lastName: lName,
        emailId: email,
        password: hashedPassword,
        age: Math.floor(Math.random() * 5) + 18,
        role: 'user',
        studentClass: studentClass,
        rating: rating,
        status: Math.random() > 0.8 ? 'inactive' : 'active'
      });

      // Generate dummy submissions
      const solvedIds = await generateRandomSubmissions(newUser._id, allProblems);
      
      // Update problemSolved array
      newUser.problemSolved = solvedIds;
      await newUser.save();
      
      console.log(`Created student: ${fName} ${lName} (${email}) - Rating: ${rating}`);
    }

    console.log("Seeding complete!");
    process.exit(0);

  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
