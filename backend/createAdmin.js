require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user');
const bcrypt = require('bcrypt');
const main = require('./src/config/db');

async function createAdmin() {
  try {
    await main();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      emailId: 'admin@example.com',
      password: hashedPassword,
      age: 30,
      role: 'admin'
    };
    
    await User.findOneAndUpdate({emailId: adminData.emailId}, adminData, {upsert: true, new: true});
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
