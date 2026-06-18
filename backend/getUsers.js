require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user');
const main = require('./src/config/db');

async function getUsers() {
  try {
    await main();
    
    // reset admin password
    const adminPass = await bcrypt.hash('admin123', 10);
    await User.updateOne({ emailId: 'admin@example.com' }, { password: adminPass });

    // reset aditi password
    const aditiPass = await bcrypt.hash('aditi123', 10);
    await User.updateOne({ emailId: 'aditi@hotmail.com' }, { password: aditiPass });

    const users = await User.find({}).select('firstName emailId role');
    console.log("--- USERS LIST ---");
    users.forEach(u => {
      let pass = 'student123';
      if (u.emailId === 'admin@example.com') pass = 'admin123';
      if (u.emailId === 'aditi@hotmail.com') pass = 'aditi123';
      
      console.log(`Role: ${u.role.padEnd(6)} | Name: ${u.firstName.padEnd(10)} | Email: ${u.emailId.padEnd(30)} | Password: ${pass}`);
    });

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

getUsers();
