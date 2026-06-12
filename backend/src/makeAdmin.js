require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const main = require('./config/db');

async function makeAdmin() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide the email address of the user. Example: node src/makeAdmin.js test@example.com");
        process.exit(1);
    }

    try {
        await main();
        console.log("DB connected successfully.");

        const user = await User.findOneAndUpdate(
            { emailId: email.trim().toLowerCase() },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log(`User with email "${email}" not found in the database.`);
        } else {
            console.log(`Successfully promoted ${user.firstName} (${user.emailId}) to 'admin'!`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Error promoting user:", err);
        process.exit(1);
    }
}

makeAdmin();
